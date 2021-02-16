import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";

const TokenDetailBody = ({
  item,
  likeButton,
  shareButton,
  muted,
  originalImageDimensions,
}) => {
  const getBackgroundColor = (item) => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return null;
    }
  };
  const getImageUrl = () => {
    var img_url = item.token_img_url ? item.token_img_url : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
    }
    return img_url;
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Set dimensions of the media based on available space and original aspect ratio
  const targetRef = useRef();
  const [mediaHeight, setMediaHeight] = useState(0);
  const [mediaWidth, setMediaWidth] = useState(0);

  useEffect(() => {
    setMediaHeight(targetRef.current.clientHeight);

    if (originalImageDimensions.height) {
      const aspectRatio =
        originalImageDimensions.width / originalImageDimensions.height;
      setMediaWidth(aspectRatio * targetRef.current.clientHeight);
    } else {
      setMediaWidth(1 * targetRef.current.clientHeight);
    }
  }, [targetRef]);

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalReportItem
            isOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            tid={item.tid}
          />
        </>
      ) : null}
      <div className="flex flex-row h-full">
        <div className="h-full" style={{ flexShrink: 0 }} ref={targetRef}>
          {item.token_has_video ? (
            <ReactPlayer
              url={item.token_animation_url}
              playing={true}
              loop
              controls
              muted={muted}
              height={mediaHeight}
              width={mediaWidth}
            />
          ) : (
            <div
              style={{
                backgroundColor: getBackgroundColor(item),
              }}
              className="h-full"
            >
              <img
                src={getImageUrl()}
                alt={item.token_name}
                className="h-full"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                }}
              />
            </div>
          )}
        </div>
        <div className="pr-4 pl-8 pt-4 flex-grow">
          <div
            className="text-3xl border-b-2 pb-2 text-left mb-4"
            style={{ fontWeight: 600 }}
          >
            {item.token_name}
          </div>
          {item.token_description ? (
            <div className="mb-10 " style={{ color: "#333" }}>
              {item.token_description}
            </div>
          ) : null}

          <div className="mb-12 flex flex-row">
            <div className="mr-2">{likeButton}</div> <div>{shareButton}</div>
          </div>
          <div className="flex flex-row">
            {item.creator_address ? (
              <div
                className="flex-1"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(136, 136, 136)",
                }}
              >
                Created by
                <div className="flex flex-row  mt-1">
                  <div className="flex-shrink">
                    <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
                      <a className="flex flex-row items-center showtime-follower-button rounded-full">
                        <div>
                          <img
                            alt={item.creator_name}
                            src={
                              item.creator_img_url
                                ? item.creator_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-1"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div style={{ fontWeight: 400 }}>
                          {item.creator_name}
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : null}

            {item.owner_address ? (
              <div
                className="flex-1"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(136, 136, 136)",
                }}
              >
                Owned by
                <div className="flex flex-row  mt-1">
                  <div className="flex-shrink">
                    <Link href="/p/[slug]" as={`/p/${item.owner_address}`}>
                      <a className="flex flex-row items-center showtime-follower-button rounded-full ">
                        <div>
                          <img
                            alt={item.owner_name}
                            src={
                              item.owner_img_url
                                ? item.owner_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-1"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div style={{ fontWeight: 400 }}>{item.owner_name}</div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ width: 160 }} className="mt-12">
            <a
              href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
              title="Buy on OpenSea"
              target="_blank"
              onClick={() => {
                mixpanel.track("OpenSea link click");
              }}
            >
              <img
                style={{
                  width: 160,
                  borderRadius: 7,
                  boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
                }}
                src="https://storage.googleapis.com/opensea-static/opensea-brand/listed-button-white.png"
                alt="Listed on OpenSea badge"
              />
            </a>
          </div>
          <div
            className="text-xs mt-4"
            style={{
              color: "rgb(136, 136, 136)",
              fontWeight: 400,
              cursor: "pointer",
            }}
            onClick={() => {
              setReportModalOpen(true);
            }}
          >
            Report item
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDetailBody;
