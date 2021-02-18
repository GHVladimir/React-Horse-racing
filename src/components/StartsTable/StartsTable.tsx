import {RaceStart} from '../../types/game.type';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {useState, Fragment} from 'react';
import './StartsTable.css';

interface StartsTableProps {
  starts: RaceStart[]
}

export default function StartsTable(props: StartsTableProps): JSX.Element {
  const [open, setOpen] = useState(new Map<number, boolean>());

  const startDetails = props.starts.map((start, key) => {
    return (
      <Fragment key={key}>
        <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small"
                        onClick={() => setOpen(new Map<number, boolean>().set(start.number, !open.get(start.number)))}>
              {open.get(start.number) ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>
          <TableCell>{start.number}</TableCell>
          <TableCell>{start.horse.name}</TableCell>
          <TableCell>{[start.driver.firstName, start.driver.lastName].join(', ')}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
            <Collapse in={open.get(start.number)} timeout="auto" unmountOnExit>
              <div className='collapsed-container'>
                <label data-testid='trainer-name'>Trainer name: {[start.horse.trainer.firstName, start.horse.trainer.lastName].join(', ')}</label>
                <label>Horse father: {start.horse.pedigree.father.name}</label>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>)
  });

  return props.starts.length ?
    <div className='starts-table'>
      <h2>Starts</h2>
      <Table className='my-table' size='small'>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Start number</TableCell>
            <TableCell>Horse name</TableCell>
            <TableCell>Driver name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {startDetails}
        </TableBody>
      </Table>
    </div> :
    <div></div>;
}
