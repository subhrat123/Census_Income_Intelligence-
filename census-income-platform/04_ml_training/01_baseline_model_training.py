# Databricks notebook source
from pyspark.ml.classification import *
from pyspark.ml.evaluation import *
from pyspark.sql.functions import *


# Read feature engineered data

df = spark.read.table("workspace.default.census_cleaned")


# Create label column

df = df.withColumn(
    "label",
    when(col("income") == ">80K", 1).otherwise(0)
)


# Fill numeric nulls

df = df.fillna({
    "age": 0,
    "education-num": 0,
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 0
})


# Create final feature dataset

from pyspark.ml.feature import VectorAssembler


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


final_df = assembler.transform(df)


# Select required columns

final_df = final_df.select(
    "features",
    "label"
)


# Train-test split

train_df, test_df = final_df.randomSplit(
    [0.8, 0.2],
    seed=42
)


# Logistic Regression model

lr = LogisticRegression(

    featuresCol="features",

    labelCol="label"
)


# Train model

lr_model = lr.fit(train_df)


# Predictions

predictions = lr_model.transform(test_df)


# View predictions

display(
    predictions.select(
        "features",
        "label",
        "prediction",
        "probability"
    ).limit(10)
)


# Accuracy evaluation

evaluator = MulticlassClassificationEvaluator(

    labelCol="label",

    predictionCol="prediction",

    metricName="accuracy"
)


accuracy = evaluator.evaluate(predictions)

print("Accuracy:", accuracy)

# COMMAND ----------

# Precision

precision_evaluator = MulticlassClassificationEvaluator(

    labelCol="label",

    predictionCol="prediction",

    metricName="weightedPrecision"
)

precision = precision_evaluator.evaluate(predictions)

print("Precision:", precision)

# COMMAND ----------

# Recall

recall_evaluator = MulticlassClassificationEvaluator(

    labelCol="label",

    predictionCol="prediction",

    metricName="weightedRecall"
)

recall = recall_evaluator.evaluate(predictions)

print("Recall:", recall)

# COMMAND ----------

# F1 Score

f1_evaluator = MulticlassClassificationEvaluator(

    labelCol="label",

    predictionCol="prediction",

    metricName="f1"
)

f1_score = f1_evaluator.evaluate(predictions)

print("F1 Score:", f1_score)

# COMMAND ----------

dt = DecisionTreeClassifier(

    featuresCol="features",

    labelCol="label"
)

# COMMAND ----------

# Train decision tree

dt_model = dt.fit(train_df) 

# COMMAND ----------

# Decision tree predictions

dt_predictions = dt_model.transform(test_df)

display(
    dt_predictions.select(
        "label",
        "prediction",
        "probability"
    ).limit(10)
)
# Decision tree accuracy

dt_accuracy = evaluator.evaluate(dt_predictions)

print("Decision Tree Accuracy:", dt_accuracy)

# COMMAND ----------

print("Logistic Regression Accuracy :", accuracy)

print("Decision Tree Accuracy       :", dt_accuracy)