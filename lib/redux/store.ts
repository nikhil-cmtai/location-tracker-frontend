import { configureStore } from '@reduxjs/toolkit'
import userLevelReducer from './features/userLevelSlice'
import vehicleStatusReducer from './features/vehicleStatusSlice'
import vehicleReducer from './features/vehicleSlice'
import vehicleTypeReducer from './features/vehicleTypeSlice'
import vehicleModelReducer from './features/vehicleModelSlice'
import vehicleManufacturerReducer from './features/vehicleManufacturer'
import ownerTypeReducer from './features/VehicleOwnerSlice'
import serviceProviderReducer from './features/serviceProviderSlice'
import vltdModelReducer from './features/vltdModelSlice'
import vltdManufacturerReducer from './features/vltdManufacturerSlice'
import vltDeviceReducer from './features/vltDeviceSlice'
import simReducer from './features/simSlice'
import crowdReducer from './features/crowdSlice'
import detailedIdlingReducer from './features/detailedIdilingSlice'
import distanceReportReducer from './features/distanceReportSlice'
import eventCategoryReducer from './features/eventCategorySlice'
import eventReducer from './features/event-configurationSlice'
import faqCategoryReducer from './features/faqCategorySlice'
import faqsReducer from './features/faqsSlice'
import firmwareReducer from './features/firmwareSlice'
import hierarchyReducer from './features/hierarchySlice'
import idlingSummaryReducer from './features/idlingSummarySlice'
import incidentReducer from './features/incidentSlice'
import journeyHistoryReducer from './features/journeyHistorySlice'
import rawDataReducer from './features/rawDataSlice'
import stoppageSummaryReducer from './features/stoppageSummarySlice'
import vehicleActivityReducer from './features/vehicleActivitySlice'
import subscriptionReducer from './features/subscriptionSlice'
import geoFenceReducer from './features/geoFenceSlice'
import planReducer from './features/planSlice'
import deviceEventReducer from './features/deviceEventSlice'
import fuelTypeReducer from './features/fuelTypeSlice'
import usersReducer from './features/usersSlice'
import reactivationPlanReducer from './features/re-activationSlice'
import renewalPlanReducer from './features/renewalSlice'
import authReducer from './features/authSlice'
import roleReducer from './features/roleSlice'

export const store = configureStore({
  reducer: {
    userLevel: userLevelReducer,
    vehicleStatus: vehicleStatusReducer,
    vehicle: vehicleReducer,
    vehicleType: vehicleTypeReducer,
    vehicleModel: vehicleModelReducer,
    vehicleManufacturer: vehicleManufacturerReducer,
    ownerType: ownerTypeReducer,
    serviceProvider: serviceProviderReducer,
    vltdModel: vltdModelReducer,
    vltdManufacturer: vltdManufacturerReducer,
    vltDevice: vltDeviceReducer,
    sim: simReducer,
    crowd: crowdReducer,
    detailedIdling: detailedIdlingReducer,
    distanceReport: distanceReportReducer,
    eventCategory: eventCategoryReducer,
    event: eventReducer,
    faqCategory: faqCategoryReducer,
    faqs: faqsReducer,
    firmware: firmwareReducer,
    hierarchy: hierarchyReducer,
    idlingSummary: idlingSummaryReducer,
    incident: incidentReducer,
    journeyHistory: journeyHistoryReducer,
    rawData: rawDataReducer,
    stoppageSummary: stoppageSummaryReducer,
    vehicleActivity: vehicleActivityReducer,
    subscription: subscriptionReducer,
    geoFence: geoFenceReducer,
    plan: planReducer,
    deviceEvent: deviceEventReducer,
    fuelType: fuelTypeReducer,
    users: usersReducer,
    reactivationPlan: reactivationPlanReducer,
    renewalPlan: renewalPlanReducer,
    auth: authReducer,
    role: roleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch