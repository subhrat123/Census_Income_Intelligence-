# Databricks notebook source
from pyspark.sql.functions import *

# Read cleaned dataset

df = spark.read.table("workspace.default.census_cleaned")


# Drop unnecessary columns

df = df.drop(
    "event_time",
    "random_flag"
)


# Create label column

df = df.withColumn(
    "label",
    when(col("income") == ">80K", 1).otherwise(0)
)


# Fill remaining nulls in numeric columns

df = df.fillna({
    "age": 0,
    "education-num": 0,
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 0
})


# Select final ML features

final_df = df.select(

    "age",

    "education-num",

    "capital-gain",

    "capital-loss",

    "hours-per-week",

    "label"
)


# View final dataset

display(final_df.limit(10))


# Verify schema

final_df.printSchema()