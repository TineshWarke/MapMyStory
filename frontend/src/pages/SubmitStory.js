import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { handelError, handelSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function SubmitStory() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    const [logoutPopup, setLogoutPopup] = useState(false);
    const [storyInfo, setStoryInfo] = useState({
        title: '',
        category: '',
        story: '',
        location: [],
        anonymous: '',
        username: loggedInUser
    })

    const apiKey = '8cdfd5d74a5d45f7aabbef9bd5ddf0d5';

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    q: `${latitude},${longitude}`,
                    key: apiKey,
                },
            });
            const { results } = response.data;
            if (results.length > 0) {
                return results[0].components.city || results[0].components.town || results[0].components.village || 'Unknown';
            }
            return 'Unknown';
        } catch (error) {
            setError('Failed to fetch city name.');
            return 'Unknown';
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            setLocation(false);
            setLoading(true); // Start loading
            setTimer(setTimeout(() => {
                if (loading) {
                    // Display a loading message or spinner after 2 seconds
                    setError('Fetching location data, please wait...');
                }
            }, 2000)); // 2 seconds delay

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    clearTimeout(timer); // Clear the timer when data is successfully fetched
                    const { latitude, longitude } = position.coords;
                    const city = await reverseGeocode(latitude, longitude);
                    setLocation({ latitude, longitude, city });
                    setLoading(false); // Stop loading
                    setError(null);
                },
                (error) => {
                    clearTimeout(timer); // Clear the timer in case of an error
                    setLocation(null);
                    setError(error.message);
                    setLoading(false); // Stop loading
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const handleAnonymousChange = (e) => {
        setIsAnonymous(e.target.checked);
    };

    const handelChange = (e) => {
        const { name, value } = e.target;
        const copyStoryInfo = { ...storyInfo };
        copyStoryInfo[name] = value;
        setStoryInfo(copyStoryInfo);
    }

    const handleAddStory = async (e) => {
        e.preventDefault();
        const { title, category, story } = storyInfo;
        if (!title || !category || !story) {
            return handelError('title, category and story are required');
        }
        storyInfo.location = location ? [location.latitude, location.longitude, location.city] : ['', '', ''];
        storyInfo.anonymous = isAnonymous;
        storyInfo.username = loggedInUser
        try {
            const url = "http://localhost:8080/story/savemystory";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handelSuccess(message);
                setTimeout(() => {
                    navigate('/home')
                }, 1000);
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

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handelSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    return (
        <div className="submitstory">
            {/* Header Section */}
            <header>
                <div class="logo">MapMyStory</div>
                <nav>
                    <ul>
                        <li><a onClick={() => navigate('/home')}>Home</a></li>
                        <li><a onClick={() => navigate('/home')}>Explore</a></li>
                        <li><a href="#">Submit Story</a></li>
                        <li><a onClick={() => navigate('/profile')}>Profile</a></li>
                        <li><a onClick={() => setLogoutPopup(true)}>Logout</a></li>
                    </ul>
                </nav>
                <input type="text" placeholder="Search..." />
            </header>

            {/* Submit Story Form  */}
            <section class="submit-story">
                <h1>Share Your Story</h1>
                <form id="story-form" onSubmit={handleAddStory}>
                    <label for="title">Story Title:</label>
                    <input type="text" id="title" name="title" value={storyInfo.title} onChange={handelChange} required />

                    <label for="category">Category:</label>
                    <select id="category" name="category" onChange={handelChange} required>
                        <option></option>
                        <option value="Dream">Dream</option>
                        <option value="Travel">Travel</option>
                        <option value="Culture">Culture</option>
                        <option value="History">History</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Food">Food</option>
                        <option value="Art">Art</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="story">Your Story:</label>
                    <textarea id="story" name="story" value={storyInfo.story} onChange={handelChange} rows="5" required></textarea>

                    <div onClick={getLocation} className="getlocation">Get My Location</div>
                    {loading && <p className="city">Loading...</p>} {/* Display loading message or spinner */}
                    {location && (
                        <div className="city">
                            <p>{location.city != 'Unknown' ? `City: ${location.city}` : `Latitude ${location.latitude}, Longitude ${location.longitude}`}</p>
                        </div>
                    )}
                    {error && <p className="city">Error: {error}</p>}

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="anonymous"
                            name="anonymous"
                            checked={isAnonymous}
                            onChange={handleAnonymousChange}
                        />
                        <label htmlFor="anonymous">Submit Anonymously</label>
                    </div>

                    {!loading && <button type="submit">Submit Story</button>}
                </form>
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

export default SubmitStory;