module Spree
  module Admin
    class VenuesController < Spree::Admin::ResourceController
      before_action :find_venue, only: [:edit, :update, :destroy]
      before_filter :load_venues, only: [:index, :create, :update]

      def create
        @venue = Spree::Venue.new(venue_params)
        @venue.set_full_address
        if @venue.save
          flash[:success] = 'Venue was created.'
          redirect_to admin_venues_path
        else
          flash[:error] = 'There was an error.'
          render :index
        end
      end
      
      def update
        @venue.set_full_address
        if @venue.update_attributes(venue_params)
          redirect_to edit_admin_venue_path(@venue)
          flash[:success] = 'Venue was updated.'
        else
          flash[:error] = 'There was an error.'
          render :index
        end
      end

      private

      def load_venues
        per_page = params[:per_page] || 20
        @venues = Spree::Venue.page(params[:page]).per(per_page)
      end

      def find_venue
        @store = Spree::Venue.find(params[:id])
      end

      def venue_params
        params.require(:venue).permit( :name, :address, :street_address, :city, :country, :phone, :state, :website, :zip, :hidden)
      end
    end
  end
end
