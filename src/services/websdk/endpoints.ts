import { Endpoint } from "../../service";


export const endpoints = {

    // bcs/bcs-websdk-service/src/main/java/com/boundlessgeo/bcs
    // /websdk/controller/WebSdkPackageController.java

    // getWebsdkGeneratorVerison
    "version": new Endpoint(
        "GET", "/websdk/version",
    ),

    // buildAndPackageProject
    "package": new Endpoint(
        // Does not support GET. has @PostMapping
        // needs a file
        // returns ???
        // ultimately application/zip
        "POST", "/websdk/package",
    ),

    "manage": new Endpoint(
        "GET", "/websdk/manage",
    ),
};
