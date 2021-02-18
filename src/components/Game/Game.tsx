import {Component, ChangeEvent} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './Game.css';
import {GameType, GameInfo, GameRace, GameResponse} from '../../types/game.type';
import RacesTable from '../../components/RacesTable/RacesTable';
import {http} from '../../helpers/api';

export const GAMES_AVAILABLE = ['V75', 'V65', 'V64', 'V4'];

interface GameState {
  races: Map<string, GameRace[]>,
  openSnackBar: boolean;
  gamesError: boolean;
  gameTypes: Map<string, string>;
  racesDisplayed: GameRace[],
  upcoming: boolean,
}

export default class Game extends Component<any, GameState> {
  mounted = false;

  constructor(props: any) {
    super(props);
    this.state = {
      openSnackBar  : false,
      gamesError    : false,
      races         : new Map(),
      gameTypes     : new Map(),
      racesDisplayed: [],
      upcoming      : false,
    }
  }

  private setError(): void {
    this.setState({
      openSnackBar: true,
      gamesError  : true,
    });
  }

  private clearError(): void {
    if (this.mounted) {
      this.setState({
        openSnackBar: false,
        gamesError  : false,
      });
    }
  }

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  async getGames(event: ChangeEvent<HTMLInputElement>) {
    if (GAMES_AVAILABLE.includes(event.target.value.toUpperCase())) {
      let games: Array<GameInfo>;
      await http<GameType>(`https://www.atg.se/services/racinginfo/v1/api/products/${event.target.value.toUpperCase()}`)
        .then(response => {
          if (response.parsedBody) {
            this.clearError();
            const data = response.parsedBody;
            games = data.upcoming.length ? data.upcoming : data.results;
            if (this.mounted) {
              this.setState({
                upcoming: !!data.upcoming.length,
              });
            }
          }
        })
        .catch(() => {
          this.setError();
        });

      if (!this.state.gamesError) {
        const gameCalls = games!.map(game => http<GameResponse>(`https://www.atg.se/services/racinginfo/v1/api/games/${game.id}`));
        await Promise.all(gameCalls)
          .then(responses => {
            const races = new Map<string, GameRace[]>();
            const gameTypes = new Map<string, string>();

            if (responses.every(response => response.parsedBody)) {
              this.clearError();
              responses.forEach(response => {
                gameTypes.set(response.parsedBody!.id, response.parsedBody!['@type']);
                races.set(response.parsedBody!.id, response.parsedBody!.races);
              })

              if (this.mounted) {
                this.setState({
                  races,
                  gameTypes,
                });
              }
            }
          })
          .catch(() => {
            this.setError();
          })
      }
    } else {
      this.setState({
        races         : new Map(),
        gamesError    : false,
        openSnackBar  : false,
        gameTypes     : new Map(),
        racesDisplayed: [],
      })
    }
  }

  private showRace(raceId: string): void {
    this.setState({
      racesDisplayed: this.state.races.get(raceId) as GameRace[],
    })
  }

  render() {
    return (
      <div className='game-container'>
        <TextField className='game-input' label='Game type (V75, V65, V64, V4)' onChange={this.getGames.bind(this)}></TextField>
        <ButtonGroup className='race-type'>
          {Array.from(this.state.gameTypes.keys()).map((key) =>
            <Button onClick={() => this.showRace(key)} key={key}>{this.state.gameTypes.get(key)}</Button>)}
        </ButtonGroup>

        <RacesTable upcoming={this.state.upcoming} races={this.state.racesDisplayed}></RacesTable>

        <Snackbar data-testid='test-snackbar' open={this.state.openSnackBar} onClose={() => this.setState({openSnackBar: false})} autoHideDuration={3000}>
          <MuiAlert elevation={6} variant='filled' severity='error'>
            Something went wrong. Please contact administrator.
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }

}
