export default class Utils {
    public static degreesToRadians(degrees: number){
        return degrees * Math.PI / 180;
    }

    public static isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }
}

