/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createListing = /* GraphQL */ `
  mutation CreateListing(
    $input: CreateListingInput!
    $condition: ModelListingConditionInput
  ) {
    createListing(input: $input, condition: $condition) {
      id
      title
      owner
      address {
        street
        city
        state
        postcode
        country
      }
      price
      thumbnail
      metadata {
        bathrooms
        type
        numOfBedrooms
        bedrooms {
          id
          numOfBeds
        }
        amenities {
          essentials
          airConditioning
          wirelessInternet
          washer
          kitchen
          pool
        }
        totalBeds
        images
      }
      reviews {
        rating
        user
        text
      }
      availability
      published
      bedrooms
      rating
      createdAt
      updatedAt
    }
  }
`;
export const updateListing = /* GraphQL */ `
  mutation UpdateListing(
    $input: UpdateListingInput!
    $condition: ModelListingConditionInput
  ) {
    updateListing(input: $input, condition: $condition) {
      id
      title
      owner
      address {
        street
        city
        state
        postcode
        country
      }
      price
      thumbnail
      metadata {
        bathrooms
        type
        numOfBedrooms
        bedrooms {
          id
          numOfBeds
        }
        amenities {
          essentials
          airConditioning
          wirelessInternet
          washer
          kitchen
          pool
        }
        totalBeds
        images
      }
      reviews {
        rating
        user
        text
      }
      availability
      published
      bedrooms
      rating
      createdAt
      updatedAt
    }
  }
`;
export const deleteListing = /* GraphQL */ `
  mutation DeleteListing(
    $input: DeleteListingInput!
    $condition: ModelListingConditionInput
  ) {
    deleteListing(input: $input, condition: $condition) {
      id
      title
      owner
      address {
        street
        city
        state
        postcode
        country
      }
      price
      thumbnail
      metadata {
        bathrooms
        type
        numOfBedrooms
        bedrooms {
          id
          numOfBeds
        }
        amenities {
          essentials
          airConditioning
          wirelessInternet
          washer
          kitchen
          pool
        }
        totalBeds
        images
      }
      reviews {
        rating
        user
        text
      }
      availability
      published
      bedrooms
      rating
      createdAt
      updatedAt
    }
  }
`;
export const createBooking = /* GraphQL */ `
  mutation CreateBooking(
    $input: CreateBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    createBooking(input: $input, condition: $condition) {
      id
      owner
      dateRange {
        start
        end
      }
      totalPrice
      listingId
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateBooking = /* GraphQL */ `
  mutation UpdateBooking(
    $input: UpdateBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    updateBooking(input: $input, condition: $condition) {
      id
      owner
      dateRange {
        start
        end
      }
      totalPrice
      listingId
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteBooking = /* GraphQL */ `
  mutation DeleteBooking(
    $input: DeleteBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    deleteBooking(input: $input, condition: $condition) {
      id
      owner
      dateRange {
        start
        end
      }
      totalPrice
      listingId
      status
      createdAt
      updatedAt
    }
  }
`;
