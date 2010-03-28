class CreateGraphs < ActiveRecord::Migration
  def self.up
    create_table :graphs do |t|
      t.text :query_template
      t.decimal :lower_bound
      t.decimal :upper_bound
      t.decimal :step
      t.text :chart_uri
      t.text :engine
      t.timestamp :timestamp

      t.timestamps
    end
  end

  def self.down
    drop_table :graphs
  end
end
