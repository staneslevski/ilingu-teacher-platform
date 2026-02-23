import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import { Storage } from "aws-amplify";
import uuid from "uuid";

// core components
import Button from "../../components/CustomButtons/Button.jsx";

import defaultImage from "../../assets/img/image_placeholder.jpg";

Storage.configure({ level: "public" });
class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: defaultImage,
      uploadState: this.props.uploadState,
      editImage: ""
    };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    if (this.props.isEdit) {
      Storage.get(this.props.editingItem.image, { level: "public" })
        .then(result =>
          this.setState({
            imagePreviewUrl: result,
            editImage: result
          })
        )
        .catch(err => console.log(err));
    }
  }
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };
  handleSubmit = e => {
    e.preventDefault();
    const image = this.state.file;
    const newImg = new File(
      [image],
      `${uuid.v1()}.${image.type.split("/", 2)[1]}`,
      { type: image.type }
    );
    Storage.put(newImg.name, newImg, {
      contentType: newImg.type
    }).then(key => {
      this.setState({
        uploadState: true
      });
      this.props.uploadImage(key);
    });
  };
  handleClick = () => {
    this.fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.isEdit ? this.state.editImage : defaultImage
    });
    this.fileInput.current.value = null;
  };
  render() {
    const {
      avatar,
      addButtonProps,
      changeButtonProps,
      removeButtonProps
    } = this.props;
    const { file, uploadState } = this.state;
    return (
      <div className="fileinput text-center">
        <input
          type="file"
          onChange={this.handleImageChange}
          ref={this.fileInput}
        />
        <div
          style={{
            minWidth: "500px"
          }}
          className={"thumbnail" + (avatar ? " img-circle" : "")}
        >
          <img src={this.state.imagePreviewUrl} alt="..." />
        </div>
        <div>
          {this.state.file === null ? (
            <Button {...addButtonProps} onClick={() => this.handleClick()}>
              {avatar ? "Add Photo" : "Select image"}
            </Button>
          ) : (
            <span>
              <Button {...changeButtonProps} onClick={() => this.handleClick()}>
                Change
              </Button>
              {avatar ? <br /> : null}
              <Button
                {...removeButtonProps}
                onClick={() => this.handleRemove()}
              >
                <i className="fas fa-times" /> Remove
              </Button>
              <Button
                color="rose"
                onClick={this.handleSubmit}
                disabled={file && uploadState}
              >
                {file && uploadState ? "DONE" : "UPLOAD"}
              </Button>
            </span>
          )}
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object
};

export default ImageUpload;
