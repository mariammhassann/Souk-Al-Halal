import aboutFieldImage from "../assets/images/1774865943592.jpg";
import aboutHandsImage from "../assets/images/1774865936467.jpg";
import heroFieldImage from "../assets/images/1775225834983.jpg";
import founderImage from "../assets/images/mahmoud.jpeg";
import heroHarvestImage from "../assets/images/1774865938924.jpg";
import heroThumbImage from "../assets/images/1776255786666.jpg";
import productClovesImage from "../assets/images/1776255784893.jpg";
import productGarlicImage from "../assets/images/1776255778035.jpg";
import garlicDetailOne from "../assets/images/toom1.jpg";
import garlicDetailTwo from "../assets/images/toom2.jpg";
import garlicDetailThree from "../assets/images/toom3.jpg";
import garlicDetailFour from "../assets/images/toom4.jpg";
import garlicDetailFive from "../assets/images/toom5.jpg";

export const imageAssets = {
  hero: {
    main: heroFieldImage,
    thumb: heroThumbImage,
    slides: [heroFieldImage, heroHarvestImage, productGarlicImage]
  },
  about: {
    main: aboutFieldImage,
    secondary: aboutHandsImage
  },
  founder: {
    portrait: founderImage
  },
  products: {
    garlic: productGarlicImage,
    export: productClovesImage,
    garlicDetails: [
      garlicDetailOne,
      garlicDetailTwo,
      garlicDetailThree,
      garlicDetailFour,
      garlicDetailFive
    ]
  }
};
