import { useNavigate } from "react-router-dom";
import { handelError, handelSuccess } from "../utils";
import { useEffect, useState } from "react";
import tag from './tag.png';
import { ToastContainer } from "react-toastify";
import del from './delete.png';
import chats from './chats.png';
import send from './send.png';
import StarRating from "./StarRating";

function Profile() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    const [changepass, setchangepass] = useState(false);
    const [stories, setStories] = useState([]);
    const [story, setStory] = useState([]);
    const [falg, setFlag] = useState(false);
    const [helper, setHelper] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [logoutPopup, setLogoutPopup] = useState(false);
    const [user, setUser] = useState({ username: '' })
    const [email, setEmail] = useState('');
    const [comm, setComm] = useState(false);
    const [comment, setComment] = useState({ data: '' })
    const [total, setTotal] = useState(0);
    const [passInfo, setPassInfo] = useState({
        email: '',
        oldpass: '',
        newpass: ''
    })
    const [delStory, setDelStory] = useState({
        id: ''
    })

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        user.username = localStorage.getItem('loggedInUser');
        getUser();
    }, []);

    const handelChange = (e) => {
        const { name, value } = e.target;
        const copyPassInfo = { ...passInfo };
        copyPassInfo[name] = value;
        setPassInfo(copyPassInfo);
    }

    const handelChange2 = (e) => {
        const { name, value } = e.target;
        const copyComment = { ...comment };
        copyComment[name] = value;
        setComment(copyComment);
    }

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handelSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
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
            const { success, message, email, rating, error } = result;
            if (success) {
                console.log(message);
                setEmail(email);
                submitRating(rating);
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

    const deleteStory = async () => {
        setShowPopup(false);
        try {
            const url = "https://map-my-story-server.vercel.app/story/deletemystory";
            delStory.id = story._id;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(delStory)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                console.log(message);
                setFlag(false);
                setHelper(!helper);
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

    const changePassword = async (e) => {
        setchangepass(false)
        e.preventDefault();
        const { newpass, oldpass } = passInfo;
        passInfo.email = email;
        if (!newpass || !oldpass) {
            return handelError('new password and old password are required');
        }
        passInfo.email = email;
        try {
            const url = "https://map-my-story-server.vercel.app/auth/changepass";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handelSuccess(message);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
            passInfo.newpass = '';
            passInfo.oldpass = '';
        } catch (err) {
            handelError(err);
        }
    }

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

    const fetchStories = async () => {
        try {
            const url = "https://map-my-story-server.vercel.app/story/getstoriesbyuser";
            user.username = loggedInUser;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const result = await response.json();
            const { success, message, stories, error } = result;
            setStories(stories);
            if (success) {
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
    };

    const addComment = async () => {
        try {
            if (!comment.data) {
                return handelError('Type something.......');
            }
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
    }, [, loggedInUser, helper]);

    return (
        <div className="profile">
            {/* Header Section */}
            <header>
                <div class="logo">MapMyStory</div>
                <nav>
                    <ul>
                        <li><a onClick={() => navigate('/home')}>Home</a></li>
                        <li><a onClick={() => navigate('/home')}>Explore</a></li>
                        <li><a onClick={() => navigate('/submitstory')}>Submit Story</a></li>
                        <li><a href="#">Profile</a></li>
                        <li><a onClick={() => setLogoutPopup(true)}>Logout</a></li>
                    </ul>
                </nav>
                {/* <input type="text" placeholder="Search..." /> */}
                <span> <p>{Math.round(total * 10) / 10}</p>
                    <StarRating onRatingChange={submitRating} className='rateing' />
                </span>
            </header>

            {/* Profile Section */}
            <section className="profileinfo">
                <div className="info">
                    <h3>{loggedInUser}</h3>
                </div>
                <div className="info">
                    <h3>{email}</h3>
                </div>
                {
                    !changepass ?
                        <div className="info" onClick={() => setchangepass(true)}>
                            <h3>Change Password</h3>
                        </div>
                        :
                        <div className="info" onClick={changePassword}>
                            <h3>Submit</h3>
                        </div>
                }
                <div className="info">
                    <h3>Story Post Count: {stories.length}</h3>
                </div>
                {
                    changepass && <div>
                        <input type="text" name="oldpass" value={passInfo.oldpass} onChange={handelChange} placeholder="Enter old password..." />
                    </div>
                }
                {
                    changepass && <div>
                        <input type="text" name="newpass" value={passInfo.newpass} onChange={handelChange} placeholder="Enter new password..." />
                    </div>
                }
            </section>

            {/* Featured Stories Section  */}
            <section class="featured-stories" id='explore'>
                <h2>My Stories</h2>
                <div class="story-carousel">
                    {stories.map((story, index) => (
                        <div className='story-card'
                            onClick={() => { setFlag(true); setStory(story) }}>
                            <h3> {story.title} </h3>
                            <p> {story.story} </p>
                        </div>
                    ))}

                    {
                        falg && <div className='story'>
                            <div className='number' id='close' onClick={() => setFlag(false)}>x</div>
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

                                <input type="textarea" name="data" value={comment.data} onChange={handelChange2} placeholder="Type something..." />
                                <div className='send' onClick={addComment}>
                                    <span className='number'><img src={send} /></span>
                                </div>
                            </div>
                            <div className='del' onClick={() => setShowPopup(true)}>
                                <span className='number'><img src={del} /></span>
                            </div>
                            <div className='tag'>
                                <span className='number'><img src={tag} /></span>
                                <h3 id='category'>{story.category}</h3>
                            </div>
                        </div>
                    }

                    {showPopup && (
                        <div className="popup2">
                            <div className="popup-content2">
                                <p>Are you sure you want to delete this story?</p>
                                <button className="popup-btn" onClick={deleteStory}>
                                    Yes
                                </button>
                                <button className="popup-btn" onClick={() => setShowPopup(false)}>
                                    No
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

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

export default Profile