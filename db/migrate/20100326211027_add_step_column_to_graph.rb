class AddStepColumnToGraph < ActiveRecord::Migration
  def self.up
    add_column :graphs, :step, :decimal
  end

  def self.down
    remove_column :graphs, :step
  end
end
