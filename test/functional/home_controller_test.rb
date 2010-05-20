require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  # Replace this with your real tests.
  def test_get_index
    get :index
    assert_response :success
  end

  def test_get_jsunit
    get :jsunit
    assert_response :success
  end
end
