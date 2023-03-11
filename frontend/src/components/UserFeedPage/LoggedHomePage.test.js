/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

  import React from 'react';
  import renderer from 'react-test-renderer';
  import LoggedHomePage from './LoggedHomePage';
  
  describe('LoggedHomePage', () => {
    it('should render a Feed component', () => {
      const component = renderer.create(<LoggedHomePage />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });