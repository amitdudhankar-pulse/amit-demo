import React from "react";
import { styled } from "@stitches/react";
import { Constants } from "@/contants";
import { ContentCardV2, Text } from "@/ui/components/components";

const AuthorSection = styled("div", {
  display: "flex",
  marginTop: "$x3",
  justifyContent: "space-between",
  gap: "$y5",
  alignContent: "bottom",
});

const AuthorAvatar = styled("img", {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  objectFit: "cover",
});

const AuthorInfo = styled("div", {
  display: "flex",
  height: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  margin: "auto 0",
  flexGrow: 1,
});

const AuthorName = styled("div", {
  color: "$textColor1",
  fontSize: "20px",
  letterSpacing: "1px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const TimeAgo = styled("div", {
  color: "$timeSpecial",
  textAlign: "right",
  letterSpacing: "0.8px",
  marginTop: "$y3",
  fontSize: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignContent: "bottom",
});

const NewsCard = ({
  imageSrc,
  title,
  description,
  publisherLogo,
  publisherName,
  timeAgo,
  url,
  className,
}: {
  className?: string;
  imageSrc: string;
  title: string;
  description: string;
  publisherLogo: string;
  publisherName: string;
  timeAgo?: string;
  url: string;
}) => {
  const altImage = `${Constants.BASE_URL}/assets/ecd27d1f-30b9-41f1-924f-6e4df0f3a672.png`;
  const altIcon = `${Constants.BASE_URL}/assets/1a132da7-5db7-4e33-8f08-901db03994a4.png`;
  const [src, setSrc] = React.useState(imageSrc);
  const [iconSrc, setIconSrc] = React.useState(publisherLogo);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 6; // Maximum number of retries

  const handleIconError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setIconSrc(altIcon);
    }
  };

  return (
    // <Card maxW="md" variant={"outline"} boxShadow="2xl">
    // </Card>

    <ContentCardV2
      disableMargins={true}
      className={className}
      id={url}
      title={title}
      description={description}
      url={url}
      imagePath={imageSrc}
      bottomComponent={
        <AuthorSection>
          <AuthorAvatar
            src={iconSrc}
            loading="lazy"
            alt="Publisher Image"
            onError={handleIconError}
          />
          <AuthorInfo>
            <AuthorName>
              <p>{publisherName}</p>
            </AuthorName>
            {!!timeAgo && (
              <TimeAgo>
                <Text.Indicative>{timeAgo}</Text.Indicative>
              </TimeAgo>
            )}
          </AuthorInfo>
        </AuthorSection>
      }
    />
  );
};

export default NewsCard;
