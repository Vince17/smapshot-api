const express = require("express");

const { authenticate, authorize } = require("../../utils/authorization");
const { validateDocumentedRequestParametersFor, validateRequestBodyWithJsonSchema } = require('../../utils/validation');
const controller = require("./images.controller");
const listController = require("./images.list.controller");

module.exports = () => {
  const router = new express.Router();

  // List images.
  router.get("/images",
    authenticate({ required: false }),
    validateDocumentedRequestParametersFor('GET', '/images'),
    listController.getList
  );

  // List image IDs.
  router.get("/images/id",
    authenticate({ required: false }),
    validateDocumentedRequestParametersFor('GET', '/images/id'),
    listController.getListId
  );

  // List images metadata including validated volunteer contributions.
  router.get("/images/metadata",
    authenticate(),
    authorize("owner_admin", "owner_validator"),
    validateDocumentedRequestParametersFor('GET', '/images/metadata'),
    listController.getListMetadata
  );

  // Get image statistics.
  router.get("/images/stats",
    validateDocumentedRequestParametersFor('GET', '/images/stats'),
    listController.getStats
  );

  // Real-time image locking with WebSocket.
  router.ws('/images/unlock', controller.unLockWS);
  router.ws('/images/lock', controller.lockWS);

  /* Why not using PUT ? POST function are needed with navigator.sendBeacon */

  // Unlock an image.
  router.post("/images/:id/unlock",
    validateDocumentedRequestParametersFor('POST', '/images/{imageId}/unlock'),
    controller.unlock
  );

  // Lock an image.
  router.post("/images/:id/lock",
    validateDocumentedRequestParametersFor('POST', '/images/{imageId}/lock'),
    controller.lock
  );

  // Check whether an image is locked.
  router.get("/images/:imageId/checklock",
    validateDocumentedRequestParametersFor('GET', '/images/{imageId}/checklock'),
    controller.checkLock
  );

  // Retrieve an image's attributes.
  router.get("/images/:id/attributes",
    authenticate({ required: false }),
    validateDocumentedRequestParametersFor('GET', '/images/{id}/attributes'),
    controller.getAttributes
  );

  // Get the footprint of an image.
  router.get("/images/:id/footprint",
    validateDocumentedRequestParametersFor('GET', '/images/{id}/footprint'),
    controller.getFootprint
  );

  // Update the state of an image.
  router.put("/images/:id/state",
    authenticate(),
    authorize("owner_admin", "owner_validator"),
    validateDocumentedRequestParametersFor('PUT', '/images/{id}/state'),
    validateRequestBodyWithJsonSchema('UpdateImageStateRequest'),
    controller.findImage,
    controller.updateState
  );

  return router;
}
