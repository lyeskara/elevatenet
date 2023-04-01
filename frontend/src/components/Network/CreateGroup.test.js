import React from 'react';
import ReactDOM from 'react-dom';
import CreateGroup from './CreateGroup';

describe('CreateGroup component', () => {
    // tests will go here
  });
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateGroup />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  it('updates form fields correctly', () => {
    const div = document.createElement('div');
    const component = ReactDOM.render(<CreateGroup />, div);
  
    const groupNameInput = div.querySelector('input[name="group_name"]');
    const descriptionInput = div.querySelector('textarea[name="description"]');
    const industryInput = div.querySelector('input[name="industry"]');
    const locationInput = div.querySelector('input[name="location"]');
  
    const groupName = 'Test Group';
    const description = 'This is a test group.';
    const industry = 'Technology';
    const location = 'San Francisco';
  
    groupNameInput.value = groupName;
    descriptionInput.value = description;
    industryInput.value = industry;
    locationInput.value = location;
  
    const form = div.querySelector('form');
    form.dispatchEvent(new Event('submit'));
  
    expect(component.state.groupData.group_name).toBe(groupName);
    expect(component.state.groupData.description).toBe(description);
    expect(component.state.groupData.industry).toBe(industry);
    expect(component.state.groupData.location).toBe(location);
  
    ReactDOM.unmountComponentAtNode(div);
  });
  