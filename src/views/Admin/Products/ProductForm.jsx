import React, { Fragment } from "react";
import _ from "lodash";
import { API } from "aws-amplify";
import PropTypes from "prop-types";
import { createProduct, getProduct } from "../../../libs/ilingu-libs/product";
import * as Sentry from "@sentry/browser";

// ui kit components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";

// material-ui components
import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";

// styles and icons
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import Assignment from "@material-ui/icons/Assignment";


import config from "../../../config";

Sentry.init(config.sentry);

const styles = {
  ...validationFormsStyle,
  actionBtn: {
    marginRight: "15px"
  }
};

class ProductForm extends React.Component {
  //FixMe:  Edit does not work. Edit items must be done in DynamoDB
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      product: {
        name: "",
        shortDescription: "",
        longDescription: "",
        prices:
          config.currencies.map(currency => {
            return {
              currency: currency.code,
              amount: "",
            }
          }),
        unit: ""
      },
      nameState: "",
      shortDescriptionState: "",
      longDescriptionState: "",
      pricesState: "",
      hoursState: ""
    };
  }
  componentDidMount() {
    if (this.props.product) {
      this.setState({
        editMode: true,
        product: this.props.product,
      });
    }
  }
  handleSubmit = async () => {
    try {
      if(_.isEmpty(this.props.editingItem)) {
        await createProduct(this.state.product);
        this.props.resetPagination();
      } else {
        await this.editProduct();
      }
      this.props.fetchData();
      this.props.fadeForm(false);
    } catch (e) {
      console.log(e);
    }
  };
  changePrice(event, index) {
    const product = { ...this.state.product };
    const value = event.target.value;
    product.prices[index].amount = value;
    const numberRex = new RegExp("^[0-9]+$");
    this.setState({
      product: {
        ...product,
      }
    });
    if (value && numberRex.test(value) && value > 0) {
      this.setState({ pricesState: "success" });
    } else {
      this.setState({ pricesState: "error" });
    }
  }
  change(event) {
    const product = { ...this.state.product };
    const numberRex = new RegExp("^[0-9]+$");
    const value = event.target.value;
    this.setState({
      product: {
        ...product,
        [event.target.id]: event.target.value
      }
    });
    // set validation state
    switch (event.target.id) {
      case "name":
        if (value && value.length >= 6 && value.length <= 32) {
          this.setState({ nameState: "success" });
        } else {
          this.setState({ nameState: "error" });
        }
        break;
      case "shortDescription":
        if (value && value.length >= 3 && value.length <= 16) {
          this.setState({ shortDescriptionState: "success" });
        } else {
          this.setState({ shortDescriptionState: "error" });
        }
        break;
      case "longDescription":
        if (value && value.length >= 3 && value.length <= 64) {
          this.setState({ longDescriptionState: "success" });
        } else {
          this.setState({ longDescriptionState: "error" });
        }
        break;
      case "hours":
        if (value && numberRex.test(value) && value > 0) {
          this.setState({ hoursState: "success" });
        } else {
          this.setState({ hoursState: "error" });
        }
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  render() {
    const { classes, fadeForm } = this.props;
    const { editMode, product } = this.state;
    const { currencies } = config;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {editMode
                  ? `Edit Product - ${product.name}`
                  : `Add Product - ${product.name}`}
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                {/*Name */}
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Name
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={7}>
                    <CustomInput
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      success={this.state.nameState === "success"}
                      error={this.state.nameState === "error"}
                      inputProps={{
                        onChange: event => this.change(event),
                        type: "text",
                        value: this.state.product.name
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelLeftHorizontal}>
                      <code>{this.state.nameState === "error" ? "Please correct this value" : "6 to 32 characters"}</code>
                    </FormLabel>
                  </GridItem>
                  {/* endName */}
                  {/* Short Description */}
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Short Description
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={7}>
                    <CustomInput
                      id="shortDescription"
                      formControlProps={{
                        fullWidth: true
                      }}
                      success={this.state.shortDescriptionState === "success"}
                      error={this.state.shortDescriptionState === "error"}
                      inputProps={{
                        onChange: event => this.change(event),
                        type: "text",
                        value: this.state.product.shortDescription
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelLeftHorizontal}>
                      <code>{this.state.shortDescriptionState === "error" ? "Please correct this value" : "3 to 16 characters"}</code>
                    </FormLabel>
                  </GridItem>
                  {/* End Short Description */}
                  {/* Long Description */}
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      long Description
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={7}>
                    <CustomInput
                      id="longDescription"
                      formControlProps={{
                        fullWidth: true
                      }}
                      success={this.state.longDescriptionState === "success"}
                      error={this.state.longDescriptionState === "error"}
                      inputProps={{
                        onChange: event => this.change(event),
                        type: "text",
                        value: this.state.product.longDescription
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelLeftHorizontal}>
                      <code>{this.state.longDescriptionState === "error" ? "Please correct this value" : "3 to 64 characters"}</code>
                    </FormLabel>
                  </GridItem>
                  {/* End Long Description */}
                  {/* Price(s) */}
                  {/* TODO: make this an expansible code so that it can naturally accommodate
                      TODO: other currencies */}
                  {currencies.map(currency => {
                    let index = this.state.product.prices.findIndex(price => price.currency === currency.code);
                    return (
                      <Fragment key={index}>
                        <GridItem xs={12} sm={4}>
                          <FormLabel className={classes.labelHorizontal}>
                            {currency.code + " Price"}
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <CustomInput
                            id={currency.code + "Price"}
                            formControlProps={{
                              fullWidth: true
                            }}
                            success={this.state.pricesState === "success"}
                            error={this.state.pricesState === "error"}
                            inputProps={{
                              onChange: event => this.changePrice(event, index),
                              type: "text",
                              value: this.state.product.prices[index].amount
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={3}>
                          <FormLabel className={classes.labelLeftHorizontal}>
                            <code>{this.state.longDescriptionState === "error" ? "Please correct this value" : "3 to 64 characters"}</code>
                          </FormLabel>
                        </GridItem>
                      </Fragment>
                    )
                  })}
                  {/* End Price */}
                </GridContainer>
              </form>
            </CardBody>
            <CardFooter className={classes.justifyContentCenter}>
              <Button
                onClick={() => fadeForm(false)}
                className={classes.actionBtn}
              >
                Close
              </Button>
              <Button
                color="rose"
                disabled={
                  this.state.product.name === (undefined || "") ||
                  this.state.product.shortDescription === (undefined || "") ||
                  this.state.product.longDescription === (undefined || "") ||
                  this.state.product.prices === (undefined || "") ||
                  this.state.nameState === "error" ||
                  this.state.shortDescriptionState === "error" ||
                  this.state.longDescriptionState === "error" ||
                  this.state.pricesState === "error"
                }
                onClick={editMode
                  ? () => this.props.updateProduct(product.productId, product).then(() => fadeForm(false))
                  : () => this.props.createProduct(product).then(() => fadeForm(false))
                }
              >
                {editMode ? "Edit" : "Add"}
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

ProductForm.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  resetPagination: PropTypes.func,
  fadeForm: PropTypes.func,
  editMode: PropTypes.bool,
  product: PropTypes.object,
  createProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProductForm);
