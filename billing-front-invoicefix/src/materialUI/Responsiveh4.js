import React from 'react';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default function Responsiveh3(props) {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Typography variant="h4">{props.text}</Typography>
      </ThemeProvider>
    </div>
  );
}
