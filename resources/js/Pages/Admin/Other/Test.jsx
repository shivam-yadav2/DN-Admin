import React from 'react';
import GitHubCorner from './GithubCorner';

import { WithContext as ReactTags, SEPARATORS } from 'react-tag-input';
;

const suggestions = COUNTRIES.map((country) => {
  return {
    id: country,
    text: country,
    className: '',
  };
});

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};


const App = () => {
  const [tags, setTags] = React.useState<Array<Tag>>([
    { id: 'Thailand', text: 'Thailand', className: '' },
    { id: 'India', text: 'India', className: '' },
    { id: 'Vietnam', text: 'Vietnam', className: '' },
    { id: 'Turkey', text: 'Turkey', className: '' },
  ]);

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index, newTag) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };

  const handleAddition = (tag) => {
    setTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const onClearAll = () => {
    setTags([]);
  };

  return (
    <div className="app">
      {/* <GitHubCorner /> */}

      <h1> React Tags Example </h1>
      <div>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          onTagUpdate={onTagUpdate}
          inputFieldPosition="bottom"
          editable
          clearAll
          onClearAll={onClearAll}
          maxTags={7}
        />
      </div>
    </div>
  );
};