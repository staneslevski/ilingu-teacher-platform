import React, { Fragment } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./post.css";
import _ from "lodash";
import { API } from "aws-amplify";
import PropTypes from "prop-types";

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import validationFormsStyle from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import Assignment from "@material-ui/icons/Assignment";
import ImageUpload from "./ImageUpload";

const styles = {
  ...validationFormsStyle,
  actionBtn: {
    marginRight: "15px"
  },
  editorWrapper: {
    margin: "55px auto",
    minHeight: "350px",
    width: "80%"
  }
};

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: !_.isEmpty(this.props.editingItem),
      post: {
        tags: {},
        postBody: EditorState.createEmpty(),
        image: "",
        postTitle: "",
        postSubtitle: "",
        postId: ""
      },
      postTitleState: "",
      postSubtitleState: "",
      imageLoadState: "",
      image: false,
      tags: {},
      allTags: {},
      tagTitle: "",
      editorState: EditorState.createEmpty()
    };
    this.onChange = editorState => {
      this.setState({
        post: {
          ...this.state.post,
          postBody: stateToHTML(this.state.editorState.getCurrentContent())
        },
        editorState: editorState
      });
    };
    this.setEditor = editor => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
  }
  componentDidMount() {
    this.getTags();

    if (this.state.isEdit) {
      const {
        tags,
        postBody,
        image,
        postTitle,
        postSubtitle,
        postId
      } = this.props.editingItem;
      const blocks = convertFromHTML(postBody);
      const body = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap
      );
      this.setState({
        post: {
          tags,
          postBody,
          image,
          postTitle,
          postSubtitle,
          postId
        },
        editorState: EditorState.createWithContent(body),
        image,
        tags
      });
    }
  }
  getPost = () => {
    const { postId } = this.props.editingItem;

    API.get("posts", `/posts/${postId}`, {}).then(post => {
      this.setState({
        post
      });
    });
  };
  createPost = body => {
    return API.post("posts", "/posts", {
      body
    }).then(() => this.setState({ post: {} }));
  };
  editPost = async () => {
    const { postId } = this.props.editingItem;
    await API.put("posts", `/posts/${postId}`, {
      body: this.state.post
    });
  };

  addTagToPost = (e, tag) => {
    e.preventDefault();
    const { tags, allTags } = this.state;
    const newAllTags = allTags;
    delete allTags[tag.tagId];
    const newTags = {
      ...tags,
      [tag.tagId]: tag
    };
    this.setState({
      allTags: newAllTags,
      tags: newTags,
      post: { ...this.state.post, tags: newTags }
    });
  };
  uploadImage = payload => {
    this.setState({
      post: { ...this.state.post, image: payload.key },
      image: payload.key
    });
  };
  removeTagFromPost = (e, tag) => {
    e.preventDefault();
    const { tags, allTags } = this.state;
    const newAllTags = {
      ...allTags,
      [tag.tagId]: tag
    };
    const newTags = tags;
    delete newTags[tag.tagId];
    this.setState({
      allTags: newAllTags,
      tags: newTags,
      post: { ...this.state.post, tags: newTags }
    });
  };

  getTags = () => {
    API.get("tags", "/tags", {
      queryStringParameters: {
        pageSize: process.env.REACT_APP_PAGE_SIZE
      }
    })
      .then(({ Items }) => {
        if (Items.length > 0) {
          this.setState({
            allTags: Items.reduce(
              (acc, item) => ({ ...acc, [item.tagId]: { ...item } }),
              {}
            )
          });
        }
      })
      .catch(err => console.log(err));
  };

  handleTagField = e => {
    const { value } = e.target;
    this.setState({
      tagTitle: value
    });
  };

  addCustomTag = () => {
    const body = {
      tagTitle: this.state.tagTitle
    };
    API.post("tags", "/tags", {
      body
    }).then(newTag =>
      this.setState(({ allTags }) => ({
        allTags: { ...allTags, [newTag.tagId]: newTag },
        tagTitle: ""
      }))
    );
  };

  handleSubmit = async () => {
    try {
      if (_.isEmpty(this.props.editingItem)) {
        await this.createPost(this.state.post);
      } else {
        await this.editPost();
      }
      this.props.fetchData();
      this.props.fadeForm(false);
    } catch (e) {
      console.log(e);
    }
  };

  change(event) {
    const post = { ...this.state.post };
    const value = event.target.value;
    this.setState({
      post: {
        ...post,
        [event.target.id]: event.target.value
      }
    });
    switch (event.target.id) {
      case "postTitle":
        if (value && value.length >= 6 && value.length <= 32) {
          this.setState({ postTitleState: "success" });
        } else {
          this.setState({ postTitleState: "error" });
        }
        break;
      case "postSubtitle":
        if (value && value.length >= 3 && value.length <= 60) {
          this.setState({ postSubtitleState: "success" });
        } else {
          this.setState({ postSubtitleState: "error" });
        }
        break;
      case "postBody":
        if (value && value.length >= 3 && value.length <= 1664) {
          this.setState({ postBodyState: "success" });
        } else {
          this.setState({ postBodyState: "error" });
        }
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  render() {
    const { classes, fadeForm, editingItem } = this.props;
    const { isEdit, allTags, tagTitle, tags } = this.state;
    const commonFields = [
      {
        key: "2",
        label: "Subtitle",
        validateState: this.state.postSubtitleState,
        id: "postSubtitle",
        helpText: "3 to 60 length"
      }
    ];
    const AddFields = [
      {
        key: "1",
        label: "Post Title",
        validateState: this.state.postTitleState,
        id: "postTitle",
        helpText: "6 to 32 length"
      },
      ...commonFields
    ];
    const fields = isEdit ? commonFields : AddFields;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {_.isEmpty(editingItem)
                  ? "Add Post"
                  : `Edit Post - ${editingItem.postTitle}`}
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <ImageUpload
                  uploadImage={this.uploadImage}
                  isEdit={this.state.isEdit}
                  editingItem={editingItem}
                />
              </GridContainer>
              <form>
                <GridContainer>
                  {fields.map(prop => {
                    return (
                      <Fragment key={prop.key}>
                        <GridItem xs={12} sm={2}>
                          <FormLabel className={classes.labelHorizontal}>
                            {prop.label}
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={7}>
                          {isEdit ? (
                            <CustomInput
                              success={prop.validateState === "success"}
                              error={prop.validateState === "error"}
                              id={prop.id}
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                onChange: event => this.change(event),
                                type: "text",
                                value: this.state.post
                                  ? this.state.post[prop.id]
                                  : ""
                              }}
                            />
                          ) : (
                            <CustomInput
                              success={prop.validateState === "success"}
                              error={prop.validateState === "error"}
                              id={prop.id}
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                onChange: event => this.change(event),
                                type: "text"
                              }}
                            />
                          )}
                        </GridItem>
                        <GridItem xs={12} sm={3}>
                          <FormLabel className={classes.labelLeftHorizontal}>
                            <code>
                              {prop.validateState === "error"
                                ? "Please correct this value"
                                : prop.helpText}
                            </code>
                          </FormLabel>
                        </GridItem>
                      </Fragment>
                    );
                  })}
                  <div style={styles.editorWrapper}>
                    <Editor
                      editorState={this.state.editorState}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={this.onChange}
                    />
                  </div>
                </GridContainer>
              </form>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Add Custom Tag
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={7}>
                    <CustomInput
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.handleTagField(event),
                        type: "text",
                        value: tagTitle
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <Button
                      color="rose"
                      disabled={this.state.tagTitle.length < 1}
                      onClick={this.addCustomTag}
                    >
                      Add
                    </Button>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <div className="tag-wrapper">
                    <GridItem xs={12}>
                      {Object.values(allTags).map(tag => (
                        <button
                          className="tag common-tag"
                          key={tag.tagId}
                          onClick={e => this.addTagToPost(e, tag)}
                        >
                          {tag.tagTitle}
                        </button>
                      ))}
                    </GridItem>
                    <GridItem xs={12}>
                      {Object.values(tags).map(tag => (
                        <button
                          className="tag chosen-tag"
                          key={tag.tagId}
                          onClick={e => this.removeTagFromPost(e, tag)}
                        >
                          {tag.tagTitle}
                        </button>
                      ))}
                    </GridItem>
                  </div>
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
                  this.state.postTitleState === "error" ||
                  this.state.postSubtitleState === "error" ||
                  this.state.postBodyState === "error" ||
                  this.state.image === false
                }
                onClick={this.handleSubmit}
              >
                {_.isEmpty(editingItem) ? "Add" : "Edit"}
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

PostEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  resetPagination: PropTypes.func,
  fadeForm: PropTypes.func,
  editingItem: PropTypes.object
};

export default withStyles(styles)(PostEditor);
