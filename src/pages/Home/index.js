import React, { useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "../../styles/pages/home.css";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [userRepos, setUserRepos] = useState([]);
  const [userStarredRepos, setUserStarredRepos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showUserData, setShowUserData] = useState(false);

  async function getStarredRepos() {
    const response = await axios.get(
      `https://api.github.com/users/${userName}/starred`
    );

    const firstFourStarredRepos = response.data.slice(0, 4);

    return firstFourStarredRepos;
  }

  async function getUserRepos() {
    const response = await axios.get(
      `https://api.github.com/users/${userName}/repos`
    );

    return response.data;
  }

  async function getUserInfo() {
    const response = await axios
      .get(`https://api.github.com/users/${userName}`)
      .catch((err) => {
        alert(
          "User not found! :(( Check if the username it is correct and try again ;)"
        );
      });

    return response.data;
  }

  async function handleSubmitUserForm(event) {
    event.preventDefault();

    try {
      setLoadingData(true);

      const user = await getUserInfo();
      const repos = await getUserRepos();
      const starredRepos = await getStarredRepos();

      if (user) {
        setUserInfo(user);
        setUserRepos(repos);
        setUserStarredRepos(starredRepos);

        setLoadingData(false);
        setShowUserData(true);
      }
    } catch (error) {
      setLoadingData(false);

      console.log(error);
    }
  }

  return (
    <div id="container">
      <header>
        <strong>Search for any Github user</strong>
      </header>

      <div className="content-wrapper">
        <form onSubmit={handleSubmitUserForm}>
          <input
            type="text"
            placeholder="Username here"
            value={userName}
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />
          <button type="submit">GO!</button>
        </form>

        <main>
          {loadingData ? (
            <Spinner animation="border" />
          ) : (
            <>
              {showUserData ? (
                <div className="user">
                  <div className="avatar">
                    <motion.img
                      animate={{ scale: 0.7 }}
                      drag="x"
                      dragConstraints={{ left: -100, right: 100 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      alt="avatar"
                      src={userInfo.avatar_url}
                    />
                  </div>

                  <div className="user-info">
                    <strong>User:</strong>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={userInfo.html_url}
                    >
                      <span>{userInfo.login}</span>
                    </a>

                    <strong>Followers</strong>
                    <span>{userInfo.followers}</span>

                    <strong>Location</strong>
                    <span>{userInfo.location}</span>

                    <strong>Web</strong>
                    <span>
                      {userInfo.blog ? (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={userInfo.blog}
                        >
                          {userInfo.blog}
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </span>

                    <strong>Email</strong>
                    <span>
                      {userInfo.email ? userInfo.email : <span>-</span>}
                    </span>
                  </div>
                  <div className="user-repos">
                    <div className="starred-repos">
                      <ul>
                        <strong>Top 4 starred repos</strong>
                        {userStarredRepos.length === 0 ? (
                          <li style={{ listStyleType: "none" }}>-</li>
                        ) : (
                          userStarredRepos.map((starred) => (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={starred.html_url}
                            >
                              <li key={starred.id}>{starred.name}</li>
                            </a>
                          ))
                        )}
                      </ul>
                    </div>
                    <div className="public-repos">
                      <ul>
                        <strong>{userInfo.public_repos} public repos</strong>
                        {userRepos.length === 0 ? (
                          <li style={{ listStyleType: "none" }}>-</li>
                        ) : (
                          userRepos.map((repo) => (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={repo.html_url}
                            >
                              <li key={repo.id}>{repo.name}</li>
                            </a>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <span></span>
              )}
            </>
          )}
        </main>

        <footer>
          Developed by{" "}
          <a target="_blank" rel="noreferrer" href="https://github.com/syond">
            Syond Santos
          </a>
        </footer>
      </div>
    </div>
  );
}
