require "rubygems"
require "sinatra"
require "data_mapper"
require "base64"
require "json"

DataMapper.setup(:default, "sqlite:///#{Dir.pwd}/db/api.db")

class Character
  include DataMapper::Resource

  property :id,    Serial 
  property :apiKey,   String
  property :charData,  Text
  property :updated_at, DateTime
end

Character.auto_upgrade!

get "/" do
  new_api_key = Base64.strict_encode64(Time.now.to_i.to_s)
  redirect to("/#{new_api_key}")
end

get "/:apiKey" do
  unless params['apiKey'].nil?
    read_only = params['apiKey'] =~ /ro$/
    api_key = params['apiKey'].gsub(/ro$/, '')
    @character = find_or_init_character(api_key)
    data = JSON.parse(@character.charData)
    data["apiKey"] += 'ro' if read_only
    @character.charData = data.to_json
    erb :index
  else
    render :nothing
  end
end

post "/character" do
  read_only = params['apiKey'] =~ /ro$/
  api_key = params['apiKey'].gsub(/ro$/, '')
  unless read_only
    character = find_or_init_character(api_key)
    character.charData = params['data']
    character.updated_at = Time.now
    character.save
  end
end

get "/character/:apiKey" do
  read_only = params['apiKey'] =~ /ro$/
  api_key = params['apiKey'].gsub(/ro$/, '')
  character = Character.first(apiKey: api_key)
  character.apiKey += 'ro' if read_only
  character.to_json
end

def find_or_init_character(api_key)
  character = Character.first(apiKey: api_key)
  if (character.nil?)
    character = Character.new(apiKey: api_key, charData: { apiKey: api_key }.to_json)
  end
  character
end
