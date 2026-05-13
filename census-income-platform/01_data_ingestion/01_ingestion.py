# Databricks notebook source
df = spark.read.table("workspace.default.census_data_raw")

display(df.limit(10))

# COMMAND ----------

df.printSchema()