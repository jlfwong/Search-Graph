class RemoveTimestampColumnFromGraph < ActiveRecord::Migration
  def self.up
  	remove_column :graphs, :timestamp
  end

  def self.down
  	add_column :graphs, :timestamp, :timestamp
  end
end
