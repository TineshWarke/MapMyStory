// import React from 'react';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   LinkedinShareButton,
// } from 'react-share';
// import facebook from './facebook.png';
// import twitter from './twitter.png'
// import whatsapp from './whatsapp.png';
// import linkedin from './linkedin.png'
// import instagram from './instagram.png'

// const Post = ({ title, content }) => {
//   const url = window.location.href; // The current page URL
//   const shareMessage = `Check out this post: ${title}`;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(
//       () => {
//         alert('Link copied to clipboard! Open Instagram and paste the link to share.');
//       },
//       (err) => {
//         alert('Failed to copy link. Please try manually.');
//       }
//     );
//   };

//   return (
//     <div className="post">
//       <div className="share-buttons">
//         <FacebookShareButton url={url} quote={shareMessage}>
//           <img src={facebook} />
//         </FacebookShareButton>
//         <TwitterShareButton url={url} title={shareMessage}>
//           <img src={twitter} />
//         </TwitterShareButton>
//         <WhatsappShareButton url={url} title={shareMessage}>
//           <img src={whatsapp} />
//         </WhatsappShareButton>
//         <LinkedinShareButton url={url} title={title} summary={content}>
//           <img src={linkedin} />
//         </LinkedinShareButton>
//         {/* <button onClick={() => copyToClipboard(url)}>
//         <img src={facebook} />
//         </button> */}
//       </div>
//     </div>
//   );
// };

// export default Post;
