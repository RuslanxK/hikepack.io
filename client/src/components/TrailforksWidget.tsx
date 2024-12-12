import React, { useEffect } from "react";

const TrailforksWidget = () => {
  useEffect(() => {
    // Create the Trailforks widget script dynamically
    const script = document.createElement("script");
    script.src = "https://es.pinkbike.org/ttl-86400/sprt/j/trailforks/widget.js";
    script.async = true;
    document.head.appendChild(script);

    // Cleanup to avoid duplicate scripts when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Widget container */}
      <div
        className="TrailforksWidgetMap"
        data-w="100%"
        data-h="400px"
        data-rid="55846"
        data-activitytype="1"
        data-maptype="trailforks"
        data-trailstyle="difficulty"
        data-controls="1"
        data-list="0"
        data-dml="1"
        data-layers="labels,poi,polygon,directory,region"
        data-z=""
        data-lat=""
        data-lon=""
        data-hideunsanctioned="0"
        data-basicmap="0"
      ></div>
      
    
    </div>
  );
};

export default TrailforksWidget;
