import React from "react";

class OverlayImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  handleLoad = () => {
    this.setState({ loaded: true });
  };

  render() {
    const { image1, image2 } = this.props;
    const { loaded } = this.state;

    return (
      <div className="">
        <img
          src={image1}
          alt="Background"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={this.handleLoad}
        />
        <img
          src={image2}
          alt="Overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0.5,
            transition: "opacity 0.5s",
          }}
        />
      </div>
    );
  }
}

export default OverlayImage;
