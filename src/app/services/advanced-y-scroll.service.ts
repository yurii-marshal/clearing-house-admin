import {Injectable} from "@angular/core";

@Injectable()
export class AdvancedYScrollService {
    SETTINGS = {
        navBarTravelling: false,
        navBarTravelDirection: "",
        navBarTravelDistance: 100
    };

    constructor() {
    }

    initAdvancedHorizontalScroll() {
        const that = this;
        let pnAdvancerLeft = document.getElementById("pnAdvancerLeft");
        let pnAdvancerRight = document.getElementById("pnAdvancerRight");

        let pnProductNav = document.getElementById("pnProductNav");
        let pnProductNavContent = document.getElementById("pnProductNavContent");

        pnProductNav.setAttribute("data-overflowing", that.determineOverflow(pnProductNavContent, pnProductNav));

        let addTranslate = 0;

        pnAdvancerLeft.addEventListener("click", function () {
            console.log(that.determineOverflow(pnProductNavContent, pnProductNav));
            if (that.determineOverflow(pnProductNavContent, pnProductNav) === "left" ||
                that.determineOverflow(pnProductNavContent, pnProductNav) === "both") {
                addTranslate -= that.SETTINGS.navBarTravelDistance;
                pnProductNavContent.style.transform = "translateX(-" + addTranslate + "px)";
                // pnProductNavContent.scrollLeft = 500;
                that.SETTINGS.navBarTravelDirection = "left";
                that.SETTINGS.navBarTravelling = true;
            }
            pnProductNav.setAttribute("data-overflowing", that.determineOverflow(pnProductNavContent, pnProductNav));
        });

        pnAdvancerRight.addEventListener("click", function () {
            console.log(that.determineOverflow(pnProductNavContent, pnProductNav));
            if (that.determineOverflow(pnProductNavContent, pnProductNav) === "right" ||
                that.determineOverflow(pnProductNavContent, pnProductNav) === "both") {
                addTranslate += that.SETTINGS.navBarTravelDistance;
                pnProductNavContent.style.transform = "translateX(-" + addTranslate + "px)";
                // pnProductNavContent.scrollLeft = 500;
                that.SETTINGS.navBarTravelDirection = "right";
                that.SETTINGS.navBarTravelling = true;
            }
            pnProductNav.setAttribute("data-overflowing", that.determineOverflow(pnProductNavContent, pnProductNav));
        });
    }

    determineOverflow(content, container) {
        let containerMetrics = container.getBoundingClientRect();
        let containerMetricsRight = Math.floor(containerMetrics.right);
        let containerMetricsLeft = Math.floor(containerMetrics.left);
        let contentMetrics = content.getBoundingClientRect();
        let contentMetricsRight = Math.floor(contentMetrics.right);
        let contentMetricsLeft = Math.floor(contentMetrics.left);
        console.log(containerMetricsLeft, contentMetricsLeft, containerMetricsRight, contentMetricsRight);
        if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            this.SETTINGS.navBarTravelDirection = "both";
        } else if (contentMetricsLeft < containerMetricsLeft) {
            this.SETTINGS.navBarTravelDirection = "left";
        } else if (contentMetricsRight > containerMetricsRight) {
            this.SETTINGS.navBarTravelDirection = "right";
        } else {
            this.SETTINGS.navBarTravelDirection = "none";
        }

        return this.SETTINGS.navBarTravelDirection;
    }
}