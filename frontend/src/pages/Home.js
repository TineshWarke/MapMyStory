import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handelError, handelSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import tag from './tag.png';
import Post from './Post';
import share from './share.png';
import chats from './chats.png';
import send from './send.png';
import StarRating from './StarRating';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [user, setUser] = useState({ username: '' })
    const [stories, setStories] = useState([]);
    const [allStories, setAllStories] = useState([]);
    const navigate = useNavigate();
    const pages = Array.from({ length: 10 }, (_, i) => i + 1);
    const [activeIndex, setActiveIndex] = useState(1);
    const [falg, setFlag] = useState(false);
    const [story, setStory] = useState([]);
    const [helper, setHelper] = useState(true);
    const [comm, setComm] = useState(false);
    const [logoutPopup, setLogoutPopup] = useState(false);
    const url = window.location.href;
    const [comment, setComment] = useState({ data: '' })
    const [total, setTotal] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [storyCount, setStoryCount] = useState(0);
    const [page, setPage] = useState({
        pageno: ''
    });

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        user.username = localStorage.getItem('loggedInUser');
        getUser();
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handelSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handelChange = (e) => {
        const { name, value } = e.target;
        const copyComment = { ...comment };
        copyComment[name] = value;
        setComment(copyComment);
    }

    const fetchStories = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/story/getstories";
            const copyPage = { ...page };
            copyPage['pageno'] = activeIndex;
            setPage(copyPage);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(copyPage)
            });
            const result = await response.json();
            const { success, message, stories, allStories, error } = result;
            setStories(stories);
            setAllStories(allStories);
            if (success) {
                console.log(message);
                setStoryCount(allStories.length);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    };

    const updateLike = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/story/like";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: story._id,
                    username: user.username
                })
            });

            const result = await response.json();
            const { success, message, likes, error } = result;
            setStory(likes);
            if (success) {
                setHelper(!helper);
                console.log(message);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    }

    const addComment = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/story/addcomment";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: story._id,
                    comment: comment.data,
                    username: loggedInUser
                })
            });

            const result = await response.json();
            const { success, message, data, error } = result;
            setStory(data);
            if (success) {
                setHelper(!helper);
                setComment({ data: '' });
                console.log(message);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    }

    const getAboutUs = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/story/getaboutus";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: '66ac96e2f5e1eec0dbbbd5a7'
                })
            });

            const result = await response.json();
            const { success, message, data, error } = result;
            if (success) {
                setStory(data);
                setFlag(true);
                console.log(message);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    }

    const customIcon = new Icon({
        iconUrl: require("./location.png"),
        iconSize: [38, 38]
    });

    const createClusterCustomIcon = function (cluster) {
        return new divIcon({
            html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
            className: "custom-marker-cluster",
            iconSize: point(33, 33, true)
        });
    };

    const handleScroll = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                alert('Link copied to clipboard! paste the link to share.');
            },
            (err) => {
                alert('Failed to copy link. Please try manually.');
            }
        );
    };

    const getUser = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/auth/getuser";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const result = await response.json();
            const { success, message, rating, count, error } = result;
            if (success) {
                console.log(message);
                submitRating(rating);
                setUserCount(count);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    };

    const submitRating = async (r) => {
        try {
            const url = "https://map-my-story-server.vercel.app/auth/rateus";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user.username, rating: r })
            });

            const result = await response.json();
            const { success, message, rate, error } = result;
            if (success) {
                console.log(message);
                setTotal(rate != null ? rate : 0);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    }

    useEffect(() => {
        fetchStories();
    }, [, activeIndex, helper]);

    return (
        <div className='home'>
            {/* Header Section */}
            <header>
                <div class="logo">MapMyStory</div>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a onClick={() => handleScroll("explore")}>Explore</a></li>
                        <li><a onClick={() => navigate('/submitstory')}>Submit Story</a></li>
                        <li><a onClick={() => navigate('/profile')}>Profile</a></li>
                        <li><a onClick={() => setLogoutPopup(true)}>Logout</a></li>
                    </ul>
                </nav>
                {/* <input type="text" placeholder="Search..." /> */}
                <span> <p>{total}</p>
                    <StarRating onRatingChange={submitRating} className='rateing' />
                </span>
            </header>

            {/* Hero Section */}
            <section class="hero">
                <div id="map" class="map-preview">
                    <MapContainer center={[18.516726, 73.856255]} zoom={3}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        <MarkerClusterGroup
                            chunkedLoading
                            iconCreateFunction={createClusterCustomIcon}
                        >
                            {allStories.map((marker, index) => (
                                marker.location[0] != '' ?
                                    <Marker position={[marker.location[0], marker.location[1]]} icon={customIcon} key={index}>
                                        <Popup><div onClick={() => { setFlag(true); setStory(marker) }} className='popup-content'>{marker.title}</div></Popup>
                                    </Marker> : <div key={index}></div>
                            ))}

                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            </section>

            {/* Featured Stories Section  */}
            <section class="featured-stories" id='explore'>
                <h2>Featured Stories</h2>
                <div class="story-carousel">
                    {stories.map((story, index) => (
                        <div className='story-card' key={index}
                            onClick={() => { setFlag(true); setStory(story) }}>
                            <h3> {story.title} </h3>
                            <p> {story.story} </p>
                        </div>
                    ))}

                    {
                        falg && <div className='story'>
                            <div className='number' id='close' onClick={() => { setFlag(false); setComm(false) }}>x</div>
                            <div id='title'>
                                <h1>{story.title}</h1>
                            </div>
                            <div id='description' style={{ whiteSpace: 'pre-line' }}>
                                <p>{story.story}</p>
                                {
                                    story.anonymous ? <h4 className='author'> - Anonymous</h4> :
                                        <h4 className='author'> - {story.username}</h4>
                                }
                            </div>
                            <div className='like' onClick={updateLike}>
                                <span className='number'>❤️</span>
                                <span id="like-count">{story.likeby.length}</span>
                            </div>
                            <div className='comments'>
                                <span className='number' onClick={() => { setComm(!comm) }}><img src={chats} /></span>
                                <span id="comment-count">{story.comments.length}</span>
                            </div>
                            <div className={`comm ${comm ? 'active' : ''}`}>
                                <div className={`data ${comm ? 'active' : ''}`}>
                                    {story.comments.slice().reverse().map((c, index) => (
                                        <div key={index}>
                                            <h4>{c.user}:</h4>
                                            <p>{c.comment}</p>
                                        </div>
                                    ))}
                                </div>

                                <input type="textarea" name="data" value={comment.data} onChange={handelChange} placeholder="Type something..." />
                                <div className='send' onClick={addComment}>
                                    <span className='number'><img src={send} /></span>
                                </div>
                            </div>
                            <div className='share'>
                                <span><img src={share} onClick={() => copyToClipboard(url)} /></span>
                            </div>
                            <div className='tag'>
                                <span className='number'><img src={tag} /></span>
                                <h3 id='category'>{story.category}</h3>
                            </div>
                        </div>
                    }
                </div>
            </section>

            {/* Page Number Section */}
            <section className='pages'>
                {pages.map((number) => (
                    <div
                        className={`number ${activeIndex === number ? 'active' : ''}`}
                        onClick={() => handleClick(number)}>{number}</div>
                ))}
            </section>

            {/* About Section */}
            <section class="about">
                <div className='line'>
                    <div className="box"><h3>Total User: {userCount}</h3></div>
                    <h2 onClick={getAboutUs} className='helper'>About Us</h2>
                    <div className="box"><h3>Total  Story: {storyCount}</h3></div>
                </div>

                <p>Welcome to MapMyStory, a platform where the world comes together to share experiences, explore cultures, and connect through the power of storytelling.</p>
                <p>How it works: Pin a Location, Share Your Story, Connect with Others.</p>
            </section>

            {/* Footer Section */}
            {logoutPopup && (
                <div className="popup2">
                    <div className="popup-content2">
                        <p>Are you sure you want to logout?</p>
                        <button className="popup-btn" onClick={handleLogout}>
                            Yes
                        </button>
                        <button className="popup-btn" onClick={() => setLogoutPopup(false)}>
                            No
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    )
}

export default Home;