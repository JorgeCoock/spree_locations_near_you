require 'spec_helper'
require 'factories'

describe Spree::Admin::VenuesController do
  stub_authorization!
  let(:venue) { FactoryGirl.create :spree_venue }
  let(:another_venue) { FactoryGirl.build :spree_venue }

  describe '#index' do
    before { spree_get :index }
    it { expect(response).to be_success }
    it { expect(response).to render_template(:index) }
    it { expect(response).to render_template(:index) }
  end

  describe '#create' do
    context 'with valid attributes' do
      before { spree_post :create, venue: another_venue.attributes }
      it { expect(response).to redirect_to(spree.admin_venues_path) }
      end
    end

  describe '#edit' do
    before { spree_get :edit, id: venue.id }
    it { expect(response).to be_success }
    it { expect(response).to render_template(:edit) }
  end

  describe '#update' do
    before { spree_put :update, id: venue.id, venue: venue.attributes }
    it { expect(venue.reload.name).to eq(venue.name) }
  end

  describe '#destroy' do
    before :each do
      @venue = FactoryGirl.create :spree_venue
    end

    it 'destroys the venue' do
      expect { spree_delete :destroy, id: @venue.id }.to change { Spree::Venue.count }.by(-1)
    end

    it 'redirects to index' do
      spree_delete :destroy, id: @venue.id
      expect(response).to redirect_to(spree.admin_venues_path)
    end
  end

end
