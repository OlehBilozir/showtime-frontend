import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../components/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import useKeyPress from "../hooks/useKeyPress";
import ActivityFeed from "../components/ActivityFeed";
import ModalTokenDetail from "../components/ModalTokenDetail";
import ActivityRecommendedFollows from "../components/ActivityRecommendedFollows";
//import backend from "../lib/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faComment as fasComment,
  faHeart as fasHeart,
  faFingerprint,
  faUser as fasUser,
} from "@fortawesome/free-solid-svg-icons";

const ACTIVITY_PAGE_LENGTH = 5; // 5 activity items per activity page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Activity = () => {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Home page view");
    }
  }, [typeof context.user]);

  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const [hasMoreScrolling, setHasMoreScrolling] = useState(true);
  const [activityTypeFilter, setActivityTypeFilter] = useState(0);

  const getActivity = async (type_id, page) => {
    setIsLoading(true);
    const result = await fetch(`/api/getactivity`, {
      method: "POST",
      body: JSON.stringify({
        page: page,
        activityTypeId: type_id,
      }),
    });
    const resultJson = await result.json();
    const { data } = resultJson;

    if (_.isEmpty(data) || data.length < ACTIVITY_PAGE_LENGTH) {
      setHasMoreScrolling(false);
    }

    if (page == 1) {
      setActivity(data);
    } else {
      // filter out possible repeats
      let filteredData = [];
      await data.forEach((newItem) => {
        if (!activity.find((actItem) => actItem.id === newItem.id)) {
          filteredData.push(newItem);
        }
      });
      setActivity([...activity, ...filteredData]);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    setHasMoreScrolling(true);
    setActivity([]);
    setActivityPage(1);
    getActivity(activityTypeFilter, 1);
  }, [context.user, activityTypeFilter]);

  const getNext = () => {
    setHasMoreScrolling(true);
    getActivity(activityTypeFilter, activityPage + 1);
    setActivityPage(activityPage + 1);
  };

  const [itemOpenInModal, setItemOpenInModal] = useState(null);
  const handleSetItemOpenInModal = ({ index, nftGroup }) => {
    setItemOpenInModal({ index, nftGroup });
  };

  const goToNext = () => {
    if (itemOpenInModal?.index < itemOpenInModal?.nftGroup.length - 1) {
      setItemOpenInModal({
        nftGroup: itemOpenInModal?.nftGroup,
        index: itemOpenInModal?.index + 1,
      });
    }
  };

  const goToPrevious = () => {
    if (itemOpenInModal?.index - 1 >= 0) {
      setItemOpenInModal({
        nftGroup: itemOpenInModal?.nftGroup,
        index: itemOpenInModal?.index - 1,
      });
    }
  };

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      mixpanel.track("Activity - Close NFT Modal - keyboard");
      setItemOpenInModal(null);
    }
    if (rightPress && itemOpenInModal) {
      mixpanel.track("Activity - Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && itemOpenInModal) {
      mixpanel.track("Activity - Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  /*
  const handleOpenModal = (index) => {
    setItemOpenInModal({ nftGroup: spotlightItems, index });
  };

  
  const [spotlightItems, setSpotlightItems] = useState([]);

  const getSpotlight = async () => {
    //setIsLoadingSpotlight(true);
    const response_spotlight = await backend.get(`/v1/spotlight`);
    const data_spotlight = response_spotlight.data.data;
    setSpotlightItems(data_spotlight.slice(0, 1));
    //setIsLoadingSpotlight(false);

    // Reset cache for next load
    backend.get(`/v1/spotlight?recache=1`);
  };

  useEffect(() => {
    //getHero();
    getSpotlight();
  }, []);
  */

  const handleFilterClick = (typeId) => {
    if (activityTypeFilter != typeId) {
      window.scroll({ top: 0, behavior: "smooth" });
      setActivity([]);
      setActivityTypeFilter(typeId);
    }

    //setActivityPage(1);
    //setHasMoreScrolling(true);
  };

  return (
    <Layout>
      <Head>
        <title>Showtime | Crypto Art</title>
        <meta name="description" content="Discover and showcase crypto art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase crypto art"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/home_og_card.jpg"
        />
        <meta name="og:title" content="Showtime" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Showtime" />
        <meta
          name="twitter:description"
          content="Discover and showcase crypto art"
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/home_twitter_card_2.jpg"
        />
      </Head>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={itemOpenInModal}
            setEditModalOpen={setItemOpenInModal}
            item={
              itemOpenInModal?.nftGroup
                ? itemOpenInModal.nftGroup[itemOpenInModal?.index]
                : null
            }
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            hasNext={
              !(
                itemOpenInModal?.index ===
                itemOpenInModal?.nftGroup?.length - 1
              )
            }
            hasPrevious={!(itemOpenInModal?.index === 0)}
          />
        </>
      ) : null}

      <>
        <div className="m-auto relative">
          <div className="mb-8 mt-16 text-left">
            <h1 className="text-5xl" style={{ fontFamily: "Afronaut" }}>
              News Feed
            </h1>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="px-4 py-4 h-max rounded-lg sticky top-24 bg-white shadow-md">
                <div
                  onClick={() => {
                    handleFilterClick(0);
                  }}
                  className={`hover:bg-blue-100 mb-1 p-2 rounded-lg px-3 ${
                    activityTypeFilter === 0
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-500"
                  }  cursor-pointer`}
                >
                  All News
                </div>
                <div
                  onClick={() => {
                    handleFilterClick(3);
                  }}
                  className={`hover:bg-purple-100 mb-1 p-2 rounded-lg px-3 ${
                    activityTypeFilter === 3
                      ? "text-purple-500 bg-purple-100"
                      : "text-gray-500"
                  } hover:text-purple-500 cursor-pointer flex flex-row items-center`}
                >
                  <FontAwesomeIcon
                    icon={faFingerprint}
                    className="mr-2 w-4 h-4"
                  />
                  <div>Creations</div>
                </div>
                <div
                  onClick={() => {
                    handleFilterClick(1);
                  }}
                  className={`hover:bg-pink-100 mb-1 p-2 rounded-lg px-3 ${
                    activityTypeFilter === 1
                      ? "text-pink-500 bg-pink-100"
                      : "text-gray-500"
                  } hover:text-pink-500 cursor-pointer flex flex-row items-center`}
                >
                  <FontAwesomeIcon
                    icon={activityTypeFilter === 1 ? fasHeart : faHeart}
                    className="mr-2 w-4 h-4"
                  />
                  <div>Likes</div>
                </div>
                <div
                  onClick={() => {
                    handleFilterClick(2);
                  }}
                  className={`hover:bg-blue-100 mb-1 p-2 rounded-lg px-3 ${
                    activityTypeFilter === 2
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-500"
                  } hover:text-blue-500 cursor-pointer flex flex-row items-center`}
                >
                  <FontAwesomeIcon
                    icon={activityTypeFilter === 2 ? fasComment : faComment}
                    className="mr-2 w-4 h-4"
                  />
                  <div>Comments</div>
                </div>
                <div
                  onClick={() => {
                    handleFilterClick(4);
                  }}
                  className={`hover:bg-green-100 mb-1 p-2 rounded-lg px-3 ${
                    activityTypeFilter === 4
                      ? "text-green-500 bg-green-100"
                      : "text-gray-500"
                  } hover:text-green-600 cursor-pointer flex flex-row items-center`}
                >
                  <FontAwesomeIcon
                    icon={activityTypeFilter === 4 ? fasUser : faUser}
                    className="mr-2 w-4 h-4"
                  />
                  <div>Follows</div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="" />

              {context.user === undefined ? null : context.user === null ? (
                <div className="flex flex-1 items-center justify-center mb-6">
                  <div className="text-gray-400 shadow-md bg-white rounded-lg w-full px-4 py-6 mx-4 text-center">
                    News feed preview 👇 Please{" "}
                    <span
                      className="cursor-pointer text-gray-800 hover:text-stpink"
                      onClick={() => context.setLoginModalOpen(true)}
                    >
                      sign in
                    </span>{" "}
                    to view & follow
                  </div>
                </div>
              ) : null}

              <InfiniteScroll
                dataLength={activity.length}
                next={getNext}
                hasMore={hasMoreScrolling}
                endMessage={
                  <div className="flex flex-1 items-center justify-center my-4">
                    {context.user ? (
                      <div className="text-gray-400">
                        No more activity. Follow more people.
                      </div>
                    ) : (
                      <div className="text-gray-400 shadow-md bg-white rounded-lg w-full px-4 py-6 mx-4 text-center">
                        <span
                          className="cursor-pointer text-gray-800 hover:text-stpink"
                          onClick={() => context.setLoginModalOpen(true)}
                        >
                          Sign in
                        </span>{" "}
                        to view & follow
                      </div>
                    )}
                  </div>
                }
                scrollThreshold={0.5}
              >
                <ActivityFeed
                  activity={activity}
                  setItemOpenInModal={handleSetItemOpenInModal}
                  key={activityTypeFilter}
                />
              </InfiniteScroll>
              <div className="flex h-16 items-center justify-center mt-6">
                {isLoading && <div className="loading-card-spinner" />}
              </div>
            </div>
            <div>
              <div className=" py-4 h-max rounded-lg sticky top-24 bg-white shadow-md">
                <ActivityRecommendedFollows />
              </div>

              {/*<div className="sticky top-24">
                <div className="px-6 h-max rounded-lg border border-gray-200 bg-white shadow-md">
                  Community Spotlights [Refresh]
                  {spotlightItems ? (
                    <>
                      <div className="flex mt-4 max-w-full">
                        <ActivityImages
                          nfts={spotlightItems}
                          openModal={handleOpenModal}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="px-6 h-max rounded-lg mt-8 border border-gray-200 bg-white shadow-md">
                  Trending [Refresh]
                  <br />
                  <br />
                  <br />
                </div>
                  </div>*/}
            </div>
          </div>

          {/* Page Content */}
          <div className="flex">
            {/* Left Column */}

            <div className="flex flex-col"></div>

            <div className="flex flex-col"></div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Activity;
