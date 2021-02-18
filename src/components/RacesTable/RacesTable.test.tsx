import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import RacesTable from './RacesTable';
import {GameRace} from '../../types/game.type';

const races: GameRace[] = [
  {
    id                : '2021-02-27_23_5',
    name              : 'Borlänge Kommuns lopp - STL Klass I, Försök 3 i meeting 2 (Final Solvalla 27 mars)',
    date              : '2021-02-27',
    number            : 5,
    scheduledStartTime: '2021-02-27T16:20:00',
    starts            : [
      {
        number: 1,
        horse : {
          name    : 'Ara',
          trainer : {
            firstName: 'Jörgen',
            lastName : 'Westholm',
          },
          pedigree: {
            father: {
              name: 'Maharajah',
            },
          },
        },
        driver: {
          firstName: 'Jörgen',
          lastName : 'Westholm',
        },
      },
      {
        number: 2,
        horse : {
          name    : '',
          trainer : {
            firstName: 'Jörgen',
            lastName : 'Westholm',
          },
          pedigree: {
            father: {
              name: 'Maharajah',
            },
          },
        },
        driver: {
          firstName: 'Jörgen',
          lastName : 'Westholm',
        },
      },
    ],
  },
  {
    id                : '2021-02-27_23_6',
    name              : 'STL-Kallblodsdivisionen, Försök 4 i meeting 1 (Final Östersund 12 juni) - Fördel ston',
    date              : '2021-02-27',
    number            : 6,
    scheduledStartTime: '2021-02-27T16:42:00',
    starts            : [
      {
        number: 1,
        horse : {
          name    : 'Lill Maria',
          trainer : {
            firstName: 'Hans',
            lastName : 'Brunlöf',
          },
          pedigree: {
            father: {
              name: 'Troll Kevin',
            },
          },
        },
        driver: {
          firstName: 'Hans',
          lastName : 'Brunlöf',
        },
      },
      {
        number: 2,
        horse : {
          name    : 'Hönn Blesa',
          trainer : {
            firstName: 'Ulf',
            lastName : 'Backhouse',
          },
          pedigree: {
            father: {
              name: 'Moe Odin',
            },
          },
        },
        driver: {
          firstName: 'Ulf',
          lastName : 'Backhouse',
        },
      },
    ],
  },
]

describe('Races Table', () => {
  it('should display Upcoming races text', () => {
    render(<RacesTable upcoming={true} races={races}></RacesTable>);
    expect(screen.queryByText('Upcoming races')).toBeDefined();
  });

  it('should display Results text', () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    expect(screen.queryByText('Results')).toBeDefined();
  });

  it('should display Races table', () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    expect(screen.queryByRole('table')).toBeDefined();
  });

  it('should display 3 columns', async () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    expect((await screen.findAllByRole('columnheader')).length).toBe(3);
  });

  it('should display 2 rows', async () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    expect((await screen.findAllByRole('cell')).length).toBe(6);
  });

  it('should display appropriate data for the rows', async () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    const firstRowValues = await screen.queryAllByRole('cell').map(row => row.textContent);
    expect(firstRowValues).toStrictEqual([
      '5',
      'Borlänge Kommuns lopp - STL Klass I, Försök 3 i meeting 2 (Final Solvalla 27 mars)',
      '2021/02/27 04:20',
      '6',
      'STL-Kallblodsdivisionen, Försök 4 i meeting 1 (Final Östersund 12 juni) - Fördel ston',
      '2021/02/27 04:42',
    ]);
  });

  it('should display starts after row is clicked', async () => {
    render(<RacesTable upcoming={false} races={races}></RacesTable>);
    expect(screen.queryByText('Starts')).not.toBeInTheDocument();
    const firstRow = await screen.queryAllByRole('row')[1];
    fireEvent.click(firstRow);
    await waitFor(() => expect(screen.queryByText('Starts')).toBeInTheDocument());
  });
})
