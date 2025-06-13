import * as React from 'react';
import { expect } from 'chai';
import { createClientRender, fireEvent, screen } from 'test/utils';
import { spy } from 'sinon';
import { waitFor } from '@testing-library/react';
import ComboBox from './ComboBox';

/**
 * You can run these tests with `yarn t ComboBox`.
 */
describe('<ComboBox />', () => {
  const render = createClientRender();

  it('should prevent the default event handlers', () => {
    const handleSubmit = spy();
    const handleChange = spy();
    const { getAllByRole } = render(
      <div
        onKeyDown={(event) => {
          if (!event.defaultPrevented && event.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        {/* The ComboBox component here */}
        <ComboBox onChange={handleChange} />
      </div>,
    );

    const textbox = screen.getByRole('combobox');

    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); // open the popup
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); // focus the first option
    const options = getAllByRole('option');
    expect(textbox).to.have.attribute('aria-activedescendant', options[0].getAttribute('id'));

    fireEvent.keyDown(textbox, { key: 'Enter' }); // select the first option
    expect(handleSubmit.callCount).to.equal(0);
    expect(handleChange.callCount).to.equal(1);
  });
  it('should show loader while fetching suggestions', async () => {
    const { getByRole } = render(<ComboBox />);
    const textbox = getByRole('combobox');

    fireEvent.change(textbox, { target: { value: 'fra' } });

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeVisible();
    });
  });
  it('should call fetchSuggestions API with user input', async () => {
    const mockFetch = spy(() => Promise.resolve([{ id: 1, name: 'France' }]));

    render(<ComboBox fetchSuggestions={mockFetch} />);

    const textbox = screen.getByRole('combobox');
    fireEvent.change(textbox, { target: { value: 'fra' } });

    await waitFor(() => {
      expect(mockFetch.calledWith('fra')).to.equal(true);
    });
  });
  it('should show an error message if fetchSuggestions fails', async () => {
    const failingFetch = () => Promise.reject(new Error('API error'));

    render(<ComboBox fetchSuggestions={failingFetch} />);

    const textbox = screen.getByRole('combobox');
    fireEvent.change(textbox, { target: { value: 'fra' } });

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).to.have.text('Failed to load suggestions');
    });
  });
  it('should show error message when fetchSuggestions fails', async () => {
    const failingFetch = () => Promise.reject(new Error('Network error'));
    render(<ComboBox fetchSuggestions={failingFetch} />);

    const textbox = screen.getByRole('combobox');
    fireEvent.change(textbox, { target: { value: 'fra' } });

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeVisible();
      expect(alert).to.have.text('Failed to load suggestions');
    });
  });

  it('should show an error if the input contains invalid characters', async () => {
    render(<ComboBox />);

    const textbox = screen.getByRole('combobox');
    fireEvent.change(textbox, { target: { value: '@@@' } });

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).to.have.text('Invalid characters');
    });
  });
  it('should show "No results found" when there are no matching suggestions', async () => {
    const customFetch = () => Promise.resolve([]);
    render(<ComboBox fetchSuggestions={customFetch} />);

    const textbox = screen.getByRole('combobox');
    fireEvent.change(textbox, { target: { value: 'zzzzzz' } });

    await waitFor(() => {
      const option = screen.getByRole('option', { name: /no results found/i });
      expect(option).toBeVisible();
      expect(option).to.have.attribute('aria-disabled', 'true');
    });
  });
});
