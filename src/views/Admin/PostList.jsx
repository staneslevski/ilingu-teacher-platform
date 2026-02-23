import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { API, Storage } from "aws-amplify";
import ReactTable from "react-table";
import { CSSTransition } from "react-transition-group";

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import { cardTitle } from "../../assets/jss/material-dashboard-pro-react.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";

import PostEditor from "./PostEditor";

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

Storage.configure({ level: "public" });

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pages: 1,
      currentPage: 0,
      LastEvaluatedKeys: [],
      isFormShown: false,
      editingItem: {}
    };
    this.getPostsCount = this.getPostsCount.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.resetPagination = this.resetPagination.bind(this);
    this.fadeForm = this.fadeForm.bind(this);
  }
  componentDidMount() {
    this.getPostsCount();
  }
  getPostsCount() {
    API.get("posts", "/posts", {
      queryStringParameters: {
        Select: "COUNT"
      }
    }).then(counter => {
      this.setState({
        pages: Math.ceil(counter.Count / process.env.REACT_APP_PAGE_SIZE)
      });
    });
  }
  deletePost = (postId, image) => {
    API.del("posts", `/posts/delete/${postId}`, {})
      .then(({ Key }) => {
        const newPosts = this.state.posts.filter(
          item => item.postId !== Key.postId
        );
        this.setState({
          posts: newPosts
        });
      })
      .then(() =>
        Storage.remove(image)
          .catch(err => console.log(err))
      );
  };
  getPosts(pageSize, startToken) {
    return API.get("posts", "/posts", {
      queryStringParameters: {
        pageSize,
        startToken
      }
    });
  }
  async resetPagination() {
    await this.getPostsCount();
    this.setState({
      currentPage: 0,
      LastEvaluatedKeys: []
    });
  }
  async fetchData(state) {
    let statePage;
    if (state === undefined) {
      statePage = 0;
    } else {
      statePage = state.page;
    }
    let startToken = JSON.stringify(
      this.state.LastEvaluatedKeys[statePage - 1]
    );
    const posts = await this.getPosts(
      process.env.REACT_APP_PAGE_SIZE,
      startToken
    );
    let LastEvaluatedKeys = this.state.LastEvaluatedKeys;
    if (statePage >= this.state.currentPage) {
      LastEvaluatedKeys.push(posts.LastEvaluatedKey);
    }
    this.setState({
      currentPage: statePage,
      posts: posts.Items.map(item => {
        item.actions = (
          <Fragment>
            <Button
              justIcon
              round
              simple
              onClick={() => {
                this.setState({
                  editingItem: item,
                  isFormShown: true
                });
              }}
              color="warning"
              className="edit"
            >
              <Dvr />
            </Button>
            <Button
              onClick={() => this.deletePost(item.postId, item.image)}
              color="rose"
            >
              Delete
            </Button>
          </Fragment>
        );
        return item;
      }),
      LastEvaluatedKeys: LastEvaluatedKeys
    });
  }
  fadeForm(fade) {
    this.setState({
      isFormShown: fade,
      editingItem: {}
    });
  }
  render() {
    const { classes } = this.props;
    const { isFormShown } = this.state;
    return (
      <Fragment>
        <CSSTransition
          in={isFormShown}
          timeout={300}
          classNames="fade-form"
          unmountOnExit
        >
          <PostEditor
            fetchData={this.fetchData}
            resetPagination={this.resetPagination}
            fadeForm={this.fadeForm}
            editingItem={this.state.editingItem}
          />
        </CSSTransition>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
              </CardHeader>
              <CardBody>
                <ReactTable
                  manual
                  onFetchData={this.fetchData}
                  showPageSizeOptions={false}
                  showPageJump={false}
                  pages={this.state.pages}
                  data={this.state.posts}
                  columns={[
                    {
                      Header: "Post Title",
                      accessor: "postTitle"
                    },
                    {
                      Header: "Subtitle",
                      accessor: "postSubtitle"
                    },
                    {
                      Header: "Body",
                      accessor: "postBody"
                    },
                    {
                      Header: "Actions",
                      accessor: "actions"
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
                Add New Post
              </Button>
            )}
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

PostList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PostList);
