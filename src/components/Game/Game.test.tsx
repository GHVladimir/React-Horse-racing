import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Game from './Game';
import * as helper from '../../helpers/api';
import {GameType, GameResponse} from '../../types/game.type';

class HttpResponse<T> extends Response {
  parsedBody?: T;
}

let input: HTMLInputElement;
const httpSpy = jest.spyOn(helper, 'http');

describe('Game', () => {
  beforeEach(() => {
    const response = new HttpResponse<GameType>();
    response.parsedBody = {
      betType : 'V4',
      upcoming: [{
        id       : 'V4_2021-02-19_23_6',
        startTime: '2021-02-19T20:14:00',
      }, {
        id       : 'V4_2021-02-20_31_2',
        startTime: '2021-02-20T11:22:00',
      }],
      results : [],
    };
    httpSpy.mockReturnValue(new Promise((resolve) => resolve(response)));
    const utils = render(<Game/>);
    input = screen.getByRole('textbox') as HTMLInputElement;
    return {input, httpSpy, ...utils};
  })

  it('should render input', () => {
    expect(input).toBeInTheDocument();
  });

  it('should show snackbar on error', async () => {
    httpSpy.mockImplementation(async () => {
      throw new Error('UNKNOWN ERROR');
    });
    fireEvent.change(input, {target: {value: 'v4'}});
    await waitFor(() => expect(screen.getByTestId('test-snackbar')).toBeDefined());
  })

  it('should show races table on click', (done) => {
    fireEvent.change(input, {target: {value: 'v4'}});
    const firstGameResponse = new HttpResponse<GameResponse>();
    const secondGameResponse = new HttpResponse<GameResponse>();
    firstGameResponse.parsedBody = {
      '@type': 'game type',
      id     : 'V4_2021-02-19_23_6',
      races  : [{
        id                : '2021-02-19_23_6',
        date              : '2021-02-19',
        name              : 'K100 - For the glory',
        number            : 6,
        scheduledStartTime: '2021-02-19T20:14:00',
        starts            : [],
      }],
    };
    secondGameResponse.parsedBody = {
      '@type': 'game type 2',
      id     : 'V4_2021-02-19_23_6',
      races  : [{
        id                : 'V4_2021-02-20_31_2',
        date              : '2021-02-19',
        name              : 'K100 - For the glory',
        number            : 6,
        scheduledStartTime: '2021-02-19T20:14:00',
        starts            : [],
      }],
    };
    jest.spyOn(helper, 'http').mockReturnValueOnce(new Promise((resolve) => resolve(firstGameResponse)));
    jest.spyOn(helper, 'http').mockReturnValueOnce(new Promise((resolve) => resolve(secondGameResponse)));
    waitFor(() => expect(screen.getByText('game type 2')).toBeDefined()).then(() => {
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('table')).toBeDefined();
      done();
    });
  });
})


