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
  @character = find_or_init_character(params['apiKey'])
  erb :index
end

post "/character" do
  character = find_or_init_character(params['apiKey'])
  character.charData = params['data']
  character.updated_at = Time.now
  character.save
end

get "/character/:apiKey" do
  Character.first(apiKey: params['apiKey']).to_json
end

def find_or_init_character(api_key)
  character = Character.first(apiKey: api_key)
  if (character.nil?)
    character = Character.new(apiKey: api_key, charData: { apiKey: api_key }.to_json)
  end
  character
end
