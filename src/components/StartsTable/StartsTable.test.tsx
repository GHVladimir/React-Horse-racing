import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import StartsTable from './StartsTable';
import {RaceStart} from '../../types/game.type';

const starts: RaceStart[] = [
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
      name    : 'Negro',
      trainer : {
        firstName: 'Savo',
        lastName : 'Mujic',
      },
      pedigree: {
        father: {
          name: 'White',
        },
      },
    },
    driver: {
      firstName: 'Bane',
      lastName : 'Mojicevic',
    },
  },
]

describe('Starts Table', () => {
  it('should not display Starts heading', () => {
    render(<StartsTable starts={[]}></StartsTable>);
    expect(screen.queryByText('Starts')).not.toBeInTheDocument();
  });

  it('should display Starts heading', () => {
    render(<StartsTable starts={starts}></StartsTable>);
    expect(screen.queryByText('Starts')).toBeInTheDocument();
  });

  it('should display 4 columns', async () => {
    render(<StartsTable starts={starts}></StartsTable>);
    expect((await screen.findAllByRole('columnheader')).length).toBe(4);
  });

  it('should display 2 rows', async () => {
    render(<StartsTable starts={starts}></StartsTable>);
    expect((await screen.findAllByRole('cell')).length).toBe(10);
  });

  it('should display appropriate data for the rows', async () => {
    render(<StartsTable starts={starts}></StartsTable>);
    const firstRowValues = await screen.queryAllByRole('cell').map(row => row.textContent);
    expect(firstRowValues).toStrictEqual([
      "",
      "1",
      "Ara",
      "Jörgen, Westholm",
      "",
      "",
      "2",
      "Negro",
      "Bane, Mojicevic",
      "",
    ]);
  });

  it('should extend row and display appropriate data', async () => {
    render(<StartsTable starts={starts}></StartsTable>);
    expect(screen.queryByTestId('trainer-name')).not.toBeInTheDocument();
    const firstExtensionButton = await screen.queryAllByRole('button')[1];
    fireEvent.click(firstExtensionButton);
    await waitFor(() => expect(screen.queryByTestId('trainer-name')).toBeInTheDocument());
    const label = await screen.queryByTestId('trainer-name');
    expect(label!.textContent).toBe('Trainer name: Savo, Mujic');
  });
})
