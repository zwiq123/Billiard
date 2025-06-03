export default class Utils {
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    static isOrientationPortrait() {
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }
}
