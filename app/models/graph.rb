class Graph < ActiveRecord::Base
	validates_presence_of :query_template, :lower_bound, :upper_bound, :step, :chart_uri, :engine
	validates_format_of :chart_uri,
		:with => /^http:\/\/chart\.apis\.google\.com\/chart\?[^><\/"']*$/,
		:message => "Invalid Google Chart URI"
	validates_size_of :query_template, 
		:within => 3..50
	validates_inclusion_of :engine,
		:in => %w(yahoo google bing)
end
