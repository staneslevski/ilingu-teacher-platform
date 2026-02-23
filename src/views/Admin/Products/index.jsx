// core libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import * as Sentry from "@sentry/browser"
import config from "../../../config";

// components
import ReactTable from "react-table";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import { CSSTransition } from "react-transition-group";

// custom components
import ProductForm from "./ProductForm";

//redux action
import {createProduct, updateProduct} from "../../../redux/actions/adminInfo";

//icons
import Assignment from "@material-ui/icons/Assignment";

//styles
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

Sentry.init(config.sentry);

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  rightBtn: {
    float: "right"
  }
};

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormShown: false,
      selectedProduct: null,
    };
  }
  fadeForm(isFormShown) {
    this.setState({
      isFormShown: isFormShown,
      selectedProduct: null,
    });
  }
  render() {
    const { classes, adminInfo } = this.props;
    const { isFormShown } = this.state;
    return (
      <Fragment>
        <CSSTransition
          in={isFormShown}
          timeout={300}
          classNames="fade-form"
          unmountOnExit
        >
          {/*{isFormShown ? (*/}
            <ProductForm
              fadeForm={this.fadeForm}
              editMode={!!this.state.selectedProduct}
              product={this.state.selectedProduct}
              createProduct={this.props.createProduct}
              updateProduct={this.props.updateProduct}
            />
          {/*) : (null)}*/}
        </CSSTransition>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Products</h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  showPageJump={false}
                  data={adminInfo.products}
                  columns={[
                    {
                      Header: "Product Name",
                      accessor: "productName"
                    },
                    {
                      Header: "Short Description",
                      accessor: "shortDescription"
                    },
                    {
                      Header: "Long Description",
                      accessor: "longDescription"
                    },
                    {
                      Header: "Price",
                      accessor: "price"
                    },
                    {
                      Header: "Hours",
                      accessor: "hours"
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      maxWidth: 120
                    }
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12}>
            {this.state.isFormShown ? null : (
              <Button
                className={classes.rightBtn}
                color="rose"
                onClick={() => this.fadeForm(true)}
              >
                Add New Product
              </Button>
            )}
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

Products.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    adminInfo: state.adminInfo
  }
};

export default connect(
  mapStateToProps,
  {
    createProduct,
    updateProduct,
  }
)(withStyles(styles)(Products));
