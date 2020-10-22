/*
 * A custom form component built using Material-UI.
 * This component's value is an (ordered) array of choices [ string ]
 *
 * This component acts like a "controlled" component. Any change will
 * trigger a call to onChange with the new value, which will result in
 * a rerender.
 *
 * Use like so:
 *
 * <MultiEntryField
 *      name="choices"
 *      value=...
 *      onChange={(v) => ... }
 *      entryLabel={idx => string}
 *      addButtonLabel={string}
 *      newEntryDefault={string}
 * />
 *
 * For instance, when using Formik, you could use it like this:
 *
 * <MultiEntryField
 *      name="choices"
 *      value={values.choices}
 *      onChange={v => setFieldValue('choices', v)}
 *      entryLabel={idx => `#${idx + 1}`}
 *      addButtonLabel="Add a new choice"
 *      newEntryDefault="Enter Choice"
 * />
 *
 * @author godmar Spring 2019
 */

import React from 'react';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import MuiToolbar from '@material-ui/core/Toolbar';
import { InputAdornment, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function MultiEntryField(props) {
  const {
    value,
    entryLabel,
    addButtonLabel,
    newEntryDefault,
    onChange
  } = props;
  const options = value || [];

  function addNew() {
    onChange([...options, newEntryDefault]);
  }
  function removeOption(i) {
    let newOptions = [...options];
    newOptions.splice(i, 1);
    onChange(newOptions);
  }
  function updateOption(i, value) {
    let newOptions = [...options];
    newOptions.splice(i, 1, value);
    onChange(newOptions);
  }

  const dragstart = i => event => {
    event.dataTransfer.effectAllowed = 'move'; // default?
    event.dataTransfer.setData('dragidx', i); // remembers what's being dragged
  };

  const drop = idx => event => {
    const src = event.dataTransfer.getData('dragidx');
    if (src === idx) return;
    const reorderedChoices = options.concat();
    if (src < idx) {
      // insert src after idx
      reorderedChoices.splice(idx + 1, 0, options[src]);
      reorderedChoices.splice(src, 1);
    }
    if (idx < src) {
      // insert src before idx
      reorderedChoices.splice(src, 1);
      reorderedChoices.splice(idx, 0, options[src]);
    }
    onChange(reorderedChoices);
  };

  return (
    <div>
      {options.map((option, i) => (
        <MuiTextField
          key={i}
          onDrop={drop(i)}
          onDragOver={event => event.preventDefault()}
          value={option}
          fullWidth
          onChange={event => updateOption(i, event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="start"
                draggable={true}
                onDragStart={dragstart(i)}
              >
                <Typography>{entryLabel(i)}</Typography>
                <IconButton aria-label="Delete" onClick={() => removeOption(i)}>
                  <DeleteIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      ))}
      <MuiToolbar>
        <MuiButton color="secondary" onClick={addNew}>
          {addButtonLabel}
        </MuiButton>
      </MuiToolbar>
    </div>
  );
}
