require 'open-uri'
require 'cgi'
require 'rubygems'
require 'json'
require 'hpricot'
require 'rexml/document'

class SearchController < ApplicationController
	def bing_web
		query = params['q']
		method = params['method']
		if (method == "api") 
			key = "8E084F32A9461A1EC4DD409C436B741F1D6E3AA6"
			url = "http://api.search.live.net/json.aspx?"
			url += "Appid=" + key
			url += "&Version=2.2"
			url += "&sources=web&Web.Count=1"
			url += "&adult=off"
			url += "&query=" + CGI::escape(query)
			httpResponse = open(url).read
			result = JSON.parse(httpResponse)
			numResults = result['SearchResponse']['Web']['Total']
			if numResults == nil
				numResults = 0
			end
			@response = {
				:query      => query,
				:numResults => numResults.to_i,
				:iterator   => params['it'],
				:error      => "none"
			}.to_json
		end
	end

 	def google_web
		method = params['method']

		query = params['q']
		if (method == "api")
		  # The Search API is yielding innacurate results for estimated result count - as a result, going to screen scrap
			key = "ABQIAAAAcqAJDM5PdUhFxWaNkliwVxT2yXp_ZAY8_ufC3CFXhHIE1NvwkxR4-AMBcrRfzHqAFaAvVoKdKGJmiw";
			result = JSON.parse(open("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&filter=1&key=" + key + "&q=" + CGI::escape(query)).read)
			numResults = result['responseData']['cursor']['estimatedResultCount']
			if numResults == nil
				numResults = 0
			end
			@response = {
				:query      => query,
				:numResults => numResults.to_i,
				:iterator   => params['it'],
				:error      => "none"
			}.to_json
		elsif (method == "scrape")
			baseurl = "http://www.google.com/search?q="
			#baseurl = "http://translate.googleusercontent.com/translate_c?sl=en&tl=fr&u=http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D"
			url = baseurl + CGI::escape(query)

			begin
				httpresponse = open(baseurl + CGI::escape(query)).read

				rescue OpenURI::HTTPError
					# Google is captcha'ing
					@response = {
						:error => "Google is blocking requests (requesting captcha). Try using the API version instead.",
					}.to_json
					return 0
			end

			doc = Hpricot(httpresponse)

			if (doc/"p#resultStats"/"b").length > 2
				numResults = (doc/"p#resultStats"/"b")[2].inner_html.gsub(",","").to_i
			else
				numResults = 0
			end

			@response = {
				:query      => query,
				:numResults => numResults,
				:iterator   => params['it'],
				:error      => "none",
			}.to_json
		else
			@response = {
				:error => "Unknown Method: " + method
			}.to_json
		end
	end
end
