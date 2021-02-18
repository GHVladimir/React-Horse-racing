import {GameRace, RaceStart} from '../../types/game.type';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Component, useState, useEffect, FunctionComponent} from 'react';
import moment from 'moment';
import './RacesTable.css';
import StartsTable from '../StartsTable/StartsTable';

interface RacesTableProps {
  races: GameRace[],
  upcoming: boolean
}

export default function RacesTable(props: RacesTableProps) {
  const [starts, setStarts] = useState([] as RaceStart[]);

  useEffect(() => {
    setStarts([]);
  }, [props.races])

  const raceDetails = props.races.map((race, key) => {
    return (<TableRow key={race.id} onClick={() => setStarts(race.starts)}>
      <TableCell>{race.number}</TableCell>
      <TableCell>{race.name}</TableCell>
      <TableCell>{moment(race.scheduledStartTime).format('YYYY/MM/DD hh:mm')}</TableCell>
    </TableRow>)
  });

  return props.races.length ?
    <div>
      <h2>{props.upcoming ? 'Upcoming races' : 'Results'}</h2>
      <Table className='my-table my-table-clickable' size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Race number</TableCell>
            <TableCell>Race name</TableCell>
            <TableCell>Race start time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {raceDetails}
        </TableBody>
      </Table>
      <StartsTable starts={starts}></StartsTable>
    </div> :
    <div></div>;
}
