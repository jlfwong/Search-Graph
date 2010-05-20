ActionController::Routing::Routes.draw do |map|
	map.root :controller => 'home', :action => 'index'
  map.connect "jsunit", :controller => 'home', :action=> 'jsunit'
end
