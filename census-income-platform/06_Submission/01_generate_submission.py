# Databricks notebook source
from pyspark.sql.functions import *

from pyspark.ml.classification import *
from pyspark.ml.feature import VectorAssembler


# Read training dataset

train_df = spark.read.table(
    "workspace.default.census_cleaned"
)


# Create label column

train_df = train_df.withColumn(
    "label",
    when(col("income") == ">80K", 1).otherwise(0)
)


# Fill null values in training data

train_df = train_df.fillna({
    "age": 0,
    "education-num": 0,
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 0
})


# Assemble training features

assembler = VectorAssembler(

    inputCols=[
        "age",
        "education-num",
        "capital-gain",
        "capital-loss",
        "hours-per-week"
    ],

    outputCol="features"
)


train_final = assembler.transform(train_df)


# Train Decision Tree model

dt = DecisionTreeClassifier(

    featuresCol="features",

    labelCol="label"
)

model = dt.fit(train_final)


# Read inference dataset

test_df = spark.read.table(
    "workspace.default.inference_test_file"
)


# Fill null values in test data

test_df = test_df.fillna({
    "age": 0,
    "education-num": 0,
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 0
})


# Assemble test features

test_final = assembler.transform(test_df)


# Generate predictions

predictions = model.transform(test_final)


# Convert predictions to required labels

submission = predictions.withColumn(

    "income",

    when(col("prediction") == 1, ">80k")
    .otherwise("<=80k")
)


# Select final submission columns

submission = submission.select(
    "id",
    "income"
)


# Display final submission output

display(submission)

# COMMAND ----------

submission.write.mode("overwrite").saveAsTable(
    "workspace.default.final_submission"
)