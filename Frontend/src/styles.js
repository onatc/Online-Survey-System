const styles = theme => ({
  centered: {
    margin: '0 auto', // https://learnlayout.com/max-width.html
    maxWidth: 600
  },
  addQuestion: {
    margin: '0 auto',
    width: 800,
    maxWidth: 800
  },
  grow: {
    flexGrow: 1
  },
  centerChildren: {
    justifyContent: 'center'
  },
  hundredHeight: {
    height: '100%'
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  table: {
    minWidth: 700
  },
  list: {
    width: 250
  },
  mainMenuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  mainMenuList: {
    width: 200
  },
  textField: {
    width: '100%',
    marginBottom: 16
  },
  leftSide: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  padLeft: {
    paddingLeft: theme.spacing.unit * 4
  }
});

export default styles;
