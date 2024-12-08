import React, { useState, useEffect } from "react";
import "./CollegeTable.css";
import { FaArrowRightArrowLeft, FaArrowRightLong } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { PiCaretDownBold, PiCheckBold } from "react-icons/pi";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/college.json`)
      .then((response) => response.json())
      .then((data) => {
        setColleges(data);
        setFilteredColleges(data.slice(0, 10));
      });
  }, []);

  const loadMore = () => {
    setLoading(true);
    const currentLength = filteredColleges.length;
    if (currentLength < colleges.length) {
      setTimeout(() => {
        setFilteredColleges((prev) => [
          ...prev,
          ...colleges.slice(currentLength, currentLength + 10),
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  const sortBy = (key) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedData = [...filteredColleges].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "placement") {
        aValue = a.placement.avgPackage;
        bValue = b.placement.avgPackage;
      } else if (key === "userReview") {
        aValue = parseFloat(a.userReview.rating.split("/")[0].trim());
        bValue = parseFloat(b.userReview.rating.split("/")[0].trim());
      } else if (key === "ranking") {
        aValue = parseInt(a.ranking.position.replace("#", "").trim(), 10);
        bValue = parseInt(b.ranking.position.replace("#", "").trim(), 10);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredColleges(sortedData);
  };

  useEffect(() => {
    const filtered = colleges.filter((college) =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(filtered.slice(0, 10));
  }, [searchTerm, colleges]);

  const renderCaret = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <PiCaretDownBold />
      ) : (
        <PiCaretDownBold style={{ transform: "rotate(180deg)" }} />
      );
    }
    return <PiCaretDownBold />;
  };

  return (
    <div className="college-table-container">
      <input
        type="text"
        placeholder="Search by college name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <table className="college-table">
        <thead>
          <tr>
            <th onClick={() => sortBy("rank")}>CD Rank</th>
            <th>Colleges</th>
            <th onClick={() => sortBy("fee")}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                Course Fees {renderCaret("fee")}
              </div>
            </th>
            <th onClick={() => sortBy("placement")}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                Placement {renderCaret("placement")}
              </div>
            </th>
            <th onClick={() => sortBy("userReview")}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                User Review {renderCaret("userReview")}
              </div>
            </th>
            <th>
              <div>Ranking</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredColleges.map((college, index) => (
            <tr
              style={{
                backgroundColor: college.featured === "true" ? "" : "#ffffff",
              }}
              key={index}
              className={college.featured ? "featured" : ""}
            >
              <td>{college.rank}</td>
              <td>
                <div className="college-info">
                  {college.featured === "true" && (
                    <div className="badge">Featured</div>
                  )}

                  <img
                    src={college.logo}
                    alt={college.name}
                    className="college-logo"
                  />
                  <div className="college-details">
                    <h3>{college.name}</h3>
                    <p>{college.location}</p>
                    <div className="college-course-details">
                      <p className="course">
                        {college.course} <PiCaretDownBold />
                      </p>
                      <p className="cutoff">{college.cutoff}</p>
                    </div>
                  </div>
                </div>
                <div className="college-btn">
                  <button className="apply-now">
                    <FaArrowRightLong /> Apply Now
                  </button>
                  <button className="download-brochure">
                    <IoMdDownload /> Download Brochure
                  </button>
                  <button className="add-to-compare">
                    <input type="checkbox" /> Add to Compare
                  </button>
                </div>
              </td>
              <td>
                <div className="college-fees">
                  <h3>{college.fee}</h3>
                  <p>BE/B.Tech</p>
                  <p>-1st Year Fees</p>
                  <a href="#">
                    <FaArrowRightArrowLeft /> Compare Fees
                  </a>
                </div>
              </td>
              <td>
                <div className="college-fees">
                  <h3>{college.placement.avgPackage}</h3>
                  <p>Average Package</p>
                  <h3>{college.placement.highestPackage}</h3>
                  <p>Highest Package</p>
                  <a href="#">
                    <FaArrowRightArrowLeft /> Compare Placement
                  </a>
                </div>
              </td>
              <td>
                <div className="college-user-rating">
                  <h3>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "orange",
                        borderRadius: "50%",
                        width: "6px",
                        height: "6px",
                        marginRight: "5px",
                      }}
                    ></span>

                    {college.userReview.rating}
                  </h3>
                  <p>{college.userReview.base}</p>
                  <p>Reviews</p>
                  <p>
                    <PiCheckBold />
                    {college.badge} <PiCaretDownBold />
                  </p>
                </div>
              </td>

              <td>
                <div className="ranking-section">
                  <div className="rank-summary">
                    <span className="rank-position">
                      {college.ranking.position}
                    </span>
                    <span className="rank-details">
                      /{college.ranking.total}
                    </span>
                    <span> in India</span>
                  </div>
                  <div className="rank-year">
                    <img
                      src={college.ranking.logos[1].src}
                      alt="news"
                      style={{ width: "56px", height: "auto" }}
                    />

                    {college.ranking.year}
                  </div>
                  <div className="rank-logos">
                    {college.ranking.logos.slice(0, 3).map((logo, index) => (
                      <img
                        key={index}
                        src={logo.src}
                        alt={logo.alt}
                        className="rank-logo"
                      />
                    ))}
                    <div className="more-rankings">
                      <span>+ {college.ranking.additionalRankings} More</span>
                      <PiCaretDownBold />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="load-more-container">
        {filteredColleges.length < colleges.length && (
          <button className="load-more" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CollegeTable;
