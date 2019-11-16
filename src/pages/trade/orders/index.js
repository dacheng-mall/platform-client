import { connect } from 'dva';

function Orders(props) {
  return 'Orders';
}
function mapStateToProps({ app, orders }) {
  return { app, ...orders };
}
export default connect(mapStateToProps)(Orders);
