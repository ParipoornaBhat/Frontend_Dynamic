import React from 'react';

function Home() {


  const styles = {
    home: {
      padding: window.innerWidth < 768 ? "40px" : "7vh", // Adjust heading size based on screen width
      alignItems:"left",
      
    },
    heading: {
      backgroundColor: "transparent", // Transparent background for heading
      paddingTop: window.innerWidth < 768 ? "3vh" : "1vh", // Adjust heading size based on screen width
      fontSize: window.innerWidth < 768 ? "6vh" : "12vh", // Adjust heading size based on screen width
      fontWeight: "0",
      textAlign: "left",
      zIndex: "10", // Ensures the heading is above the video
      position: "relative",
      borderLeft: "5px solid rgb(255, 255, 255)",
      color: "rgb(255, 255, 255)", // Dark text color for contrast
     // textShadow: `
      //  3px 3px 5px rgba(0, 0, 0, 0.9),  /* Highlight layer */
      //  -3px -3px 4px rgba(238, 238, 238, 0.8),     /* Depth shadow */
      //  4px 4px 6px rgb(0, 0, 0)`, // Outer shadow for dimension
        margin:"0",
        fontFamily:"cursive",
        paddingLeft:"30px",
    },
    features: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap", // Allow the items to wrap on smaller screens
      zIndex: "100", // Ensures the feature cards are above the video
      position: "relative",
    },
    featureItem: {
      paddingBottom:"25px",

      paddingLeft: window.innerWidth < 768 ? "30px" : "80px", // Adjust heading size based on screen width
      paddingRight: window.innerWidth < 768 ? "30px" : "80px", // Adjust heading size based on screen width
      textAlign: "center",
      fontSize: window.innerWidth < 768 ? "2.25vh" : "25px", // Adjust heading size based on screen width
      color: "rgb(255, 255, 255)", // Dark text color for contrast
      textShadow: `
        3px 3px 5px rgba(0, 0, 0, 0.9),  /* Highlight layer */
        -3px -3px 4px rgba(238, 238, 238, 0.8),     /* Depth shadow */
        4px 4px 6px rgb(0, 0, 0)`,
      width: "calc(100% - 40px)", // Dynamic width for small devices
      maxWidth: "250px", // Restrict maximum width for larger devices
      zIndex: "10", // Ensures cards are above the video
      position: "relative",    

    },
    button: {
      backgroundColor: "#1AB1AA", // Transparent background for buttons
      color: "rgb(0, 0, 0)",
    
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "15px",
    },
    video: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center center",
      zIndex: "2", // Ensure the video is in the background
      opacity: 1,
    },
  };
  
  return (
    <>
      <div
        className="home"
        style={{ position: "relative", overflow: "hidden", height: "100vh" }}
      >
        {/* Video in the background */}
        <video
          id="comp-kr2160yh_video"
          className="K8MSra"
          crossOrigin="anonymous"
          playsInline
          preload="auto"
          loop
          muted
          tabIndex="-1"
          autoPlay
          src="https://video.wixstatic.com/video/a8353f_5a8a2d92ebef451d959a2d592bc0abf5/1080p/mp4/file.mp4"
          style={styles.video}
        />
  
        {/* Heading */}
        <div style={styles.home}><br/><br/>
          <h1
            style={{
              ...styles.heading,
              fontSize: window.innerWidth < 768 ? "4vh" : "12vh", // Adjust heading size based on screen width
            }}
          >
            "Where Packaging Meets Innovation and Durability."{`\n`}
          </h1>
              <br/><br/>
          {/* Features Section */}
          <div style={styles.features}>
          <div style={styles.featureItem}>
          <h3 style={{ fontWeight: "bold" }}>BOPP Orders</h3>
              <p>Manage your BOPP orders efficiently.</p>
              <button style={styles.button}>Manage Orders</button>
            </div>
            <div style={{...styles.featureItem, borderLeft:window.innerWidth < 768 ? "0" : "5px solid rgb(0, 0, 0)",borderTop:window.innerWidth > 768 ? "0" : "5px solid rgb(0, 0, 0)"}}>
              <h3 style={{ fontWeight: "bold" }}>PET Orders</h3>
              <p>Manage your PET orders effectively.</p>
              <button style={styles.button}>Manage Orders</button>
            </div>
           {/*} <div style={{...styles.featureItem, borderLeft: "1px solid rgb(255, 255, 255)",}}>
              <h3 style={{ fontWeight: "bold" }}>Flexo Orders</h3>
              <p>Manage your Flexo orders effectively.</p>
              <button style={styles.button}>Manage Orders</button>
            </div>*/}
          </div>
        </div>
      </div>
   
      



<section style={{ padding: "40px 0", backgroundColor: "#1AB1AA" }}>
      <div style={{ position: "relative" }}>
        {/* Background layers */}
        <div
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -100, // Corrected z-index to zIndex
            backgroundColor: "#1AB1AA", // Background color kept
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "35px",
            color:"white",
            lineHeight: "1.2em",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: "20px",
          }}
        >
          Premium Packaging
          <br />
          That Makes Your Brand Stand Out.
        </h1>
        <img
      src="https://static.wixstatic.com/media/a8353f_30246087f1b9406f8b2300bff5286f5e~mv2.png/v1/fill/w_370,h_420,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Group%20493.png"
      alt="Dynamic Packaging Pvt. Ltd"
      style={{
        width: "185px",
        height: "210px",
        objectFit: "cover",
      }}
    />
        <h5
          style={{
            fontSize: "22px",
            lineHeight: "1.6em",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: "40px",
          }}
        >
          Trusted Partner in Packaging for Over 25 years.
        </h5>

        <a
          href="https://www.dynamicpackagings.com/_files/ugd/a8353f_8597660e5d2f4729bf00c45aa4b63433.pdf"
          target="_blank"
          aria-label="Download Product Brochure"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: "red",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "16px",
          }}
        >
          <span>Download Product Brochure</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            style={{ marginLeft: "10px", width: "20px", height: "20px" }}
          >
            <g>
              <path d="M46.5 28.9L20.6 3c-.6-.6-1.6-.6-2.2 0l-4.8 4.8c-.6.6-.6 1.6 0 2.2l19.8 20-19.9 19.9c-.6.6-.6 1.6 0 2.2l4.8 4.8c.6.6 1.6.6 2.2 0l21-21 4.8-4.8c.8-.6.8-1.6.2-2.2z"></path>
            </g>
          </svg>
        </a>
      </div>
    </section>
    <br/>

    <br/><br/><br/><br/></>
    
  );
}

const styles = {
  heading: {
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: '20px',
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
  },
  featureItem: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '30%',
    textAlign: 'center',
    color: '#2e7d32',
  },
  button: {
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
};





// Hover animation: when the user hovers, the button will grow slightly and change its background color.
styles.button[':hover'] = {
  transform: 'scale(1.1)',
  backgroundColor: '#00796b',
};

export default Home;
